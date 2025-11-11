// RUTA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API para el widget "Actividad Reciente" del Dashboard.
 * Obtiene las 5 reservas más recientes que están pendientes.
 * Ruta: /api/admin/dashboard-activity
 * Método: GET
 */
export default defineEventHandler(async (event) => {
  try {
    const reservasPendientes = await db.reserva.findMany({
      where: {
        // Buscamos reservas que NO están finalizadas
        estado: false, 
        // Y cuyo pago está 'Pendiente'
        pago: {
          estado: 'Pendiente',
        },
      },
      orderBy: {
        fecha_reservada: 'desc', // Las más nuevas primero
      },
      take: 5, // Solo las últimas 5
      include: {
        usuario: {
          select: {
            nombre: true,
            apellido_paterno: true,
          },
        },
        detalle_reserva: {
          select: {
            nombre_servicio: true,
          }
        },
        pago: {
            select: {
                monto: true
            }
        }
      },
    });

    // 5. Formatear la respuesta
    const formatted = reservasPendientes.map(reserva => ({
      id_reserva: reserva.id_reserva,
      cliente: `${reserva.usuario?.nombre || 'Cliente'} ${reserva.usuario?.apellido_paterno || ''}`.trim(),
      servicio: reserva.detalle_reserva?.nombre_servicio || 'N/A',
      monto: Number(reserva.pago?.monto) || 0,
      fecha: reserva.fecha_reservada ? new Date(reserva.fecha_reservada).toLocaleDateString('es-CL') : 'N/A'
    }));
    
    return formatted;

  // (AQUÍ ESTABA EL ERROR)
  } catch (error: any) {
    // (CORRECCIÓN) Añadido el cuerpo del 'catch'
    console.error("Error al obtener actividad del dashboard:", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al consultar la actividad.',
    });
  }
});