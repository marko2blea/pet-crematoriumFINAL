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
      orderBy: {
        fecha_reservada: 'desc',
      },
      take: 5,
      include: {
        usuario: {
          select: {
            nombre: true,
            apellido_paterno: true,
            // (ESTA ES LA CORRECCIÓN - FALTABA INCLUIR LA MASCOTA)
            mascota: {
              select: { nombre_mascota: true },
            },
          },
        },
        detalle_reserva: {
          select: {
            nombre_servicio: true,
          },
        },
        pago: { // Necesario para el estado
          select: { estado: true }
        }
      },
    });

    // Formatear los datos para que el Dashboard los entienda
    const reservasRecientes = reservas.map((r) => {
      
      // Lógica de estado (copiada de reservas.get.ts)
      let computedStatus: 'Pendiente' | 'En Proceso' | 'Finalizado' | 'Cancelado' = 'En Proceso';
      if (r.pago?.estado === 'Pendiente') {
        computedStatus = 'Pendiente';
      } else if (r.pago?.estado === 'Cancelado') {
        computedStatus = 'Cancelado';
      } else if (r.estado === true) {
        computedStatus = 'Finalizado';
      }
      
      return {
        id: r.id_reserva,
        client: `${r.usuario?.nombre || 'Cliente'} ${r.usuario?.apellido_paterno || ''}`.trim(),
        // (ESTA ES LA CORRECCIÓN - AHORA 'pet' TIENE EL DATO CORRECTO)
        pet: r.usuario?.mascota?.nombre_mascota || 'Mascota',
        service: r.detalle_reserva?.nombre_servicio || 'N/A',
        status: computedStatus,
      };
    });

    return reservasRecientes;

  } catch (error: any) {
    console.error("Error al obtener reservas recientes:", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al consultar las reservas.',
    });
  }
});