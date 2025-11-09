// RUTA CORREGIDA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';
import type { Prisma } from '@prisma/client';

/**
 * API para obtener la lista COMPLETA de reservas, con filtros.
 * Ruta: /api/admin/reservas
 * Método: GET
 * Query Params: ?status= (Todos | Pendiente | En Proceso | Finalizado | Cancelado)
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const status = query.status as string | undefined;

    // 1. Construir el filtro de Prisma (Where clause)
    // Usamos el 'estado' (Boolean) de la reserva y el 'estado' (String) del pago
    // para crear los 4 estados que usa el frontend.
    const where: Prisma.reservaWhereInput = {};

    if (status === 'Pendiente') {
      // Un pago 'Pendiente'
      where.pago = { estado: 'Pendiente' };
    } else if (status === 'En Proceso') {
      // Una reserva 'activa' (estado=false) pero con pago NO 'Pendiente'
      where.estado = false;
      where.pago = { NOT: { estado: 'Pendiente' } };
    } else if (status === 'Finalizado') {
      // Una reserva 'cerrada' (estado=true)
      where.estado = true;
    } else if (status === 'Cancelado') {
      // Un pago 'Cancelado'
      where.pago = { estado: 'Cancelado' };
    }
    // Si status === 'Todos', el 'where' queda vacío y trae todo.


    // 2. Ejecutar la consulta
    const reservas = await db.reserva.findMany({
      where: where,
      orderBy: {
        fecha_reservada: 'desc', // Las más nuevas primero
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            apellido_paterno: true,
            mascota: {
              select: { nombre_mascota: true },
            },
          },
        },
        detalle_reserva: {
          select: { nombre_servicio: true },
        },
        pago: { // Incluimos el pago para saber el monto y el estado (Pendiente/Cancelado)
          select: { 
            monto: true,
            estado: true 
          },
        },
      },
    });

    // 3. Formatear la respuesta para que coincida con lo que espera 'reservas.vue'
    const formattedReservas = reservas.map((r) => {
      // Determinar el estado basado en la lógica del filtro
      let computedStatus: 'Pendiente' | 'En Proceso' | 'Finalizado' | 'Cancelado' = 'En Proceso'; // Default
      if (r.pago?.estado === 'Pendiente') {
        computedStatus = 'Pendiente';
      } else if (r.pago?.estado === 'Cancelado') {
        computedStatus = 'Cancelado';
      } else if (r.estado === true) {
        computedStatus = 'Finalizado';
      }

      return {
        id: r.id_reserva,
        clientName: `${r.usuario?.nombre || 'Cliente'} ${r.usuario?.apellido_paterno || ''}`.trim(),
        petName: r.usuario?.mascota?.nombre_mascota || 'Mascota',
        petBreed: '', // El schema 'especie' no está en esta consulta, lo omitimos
        serviceName: r.detalle_reserva?.nombre_servicio || 'N/A',
        trackingCode: r.cod_trazabilidad,
        status: computedStatus,
        amount: Number(r.pago?.monto) || Number(r.precio_total) || 0,
      };
    });

    return formattedReservas;

  } catch (error: any) {
    console.error("Error al obtener lista de reservas:", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al consultar las reservas.',
    });
  }
});