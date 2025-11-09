// RUTA CORREGIDA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API para obtener las 5 reservas más recientes para el Dashboard.
 * Ruta: /api/admin/reservas-recientes
 * Método: GET
 */
export default defineEventHandler(async (event) => {
  try {
    const reservas = await db.reserva.findMany({
      // 1. Ordenar por fecha (las más nuevas primero)
      orderBy: {
        fecha_reservada: 'desc',
      },
      // 2. Limitar a las últimas 5
      take: 5,
      // 3. Incluir los datos relacionados que necesitamos
      include: {
        // Incluir 'usuario' para obtener el nombre del cliente
        usuario: {
          select: {
            nombre: true,
            apellido_paterno: true,
          },
        },
        // Incluir 'detalle_reserva' para obtener el nombre del servicio
        detalle_reserva: {
          select: {
            nombre_servicio: true,
          },
        },
        // Incluir 'mascota' (que está dentro de 'usuario' en tu schema)
        // Oops, el schema dice que 'mascota' está en 'usuario', no en 'reserva' directamente.
        // Pero tu schema de 'reserva' SÍ tiene un id_usuario, así que podemos usarlo.
        // Y 'reserva' tiene un id_mascota, pero no está enlazado a 'usuario'.
        // Vamos a asumir que el id_usuario de la reserva es el cliente.
      },
    });

    // 4. Formatear los datos para que el Dashboard los entienda
    const reservasRecientes = reservas.map((r) => ({
      id: r.id_reserva,
      // Usamos el 'nombre' del usuario relacionado, o 'Cliente' si no hay
      client: `${r.usuario?.nombre || 'Cliente'} ${r.usuario?.apellido_paterno || ''}`.trim(),
      // Usamos el 'nombre_servicio' del detalle, o 'Servicio'
      service: r.detalle_reserva?.nombre_servicio || 'Servicio no especificado',
      // Mapeamos el 'estado' (Boolean) a un string legible
      status: r.estado === true ? 'Finalizado' : 'En Proceso',
    }));

    return reservasRecientes;

  } catch (error: any) {
    console.error("Error al obtener reservas recientes:", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al consultar las reservas.',
    });
  }
});