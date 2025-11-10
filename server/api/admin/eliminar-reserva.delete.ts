// RUTA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API para ELIMINAR (DELETE) una reserva completa (Reserva, Pago y Detalle).
 * Ruta: /api/admin/eliminar-reserva
 * Método: DELETE
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id: reservaId } = body;

    if (!reservaId || isNaN(Number(reservaId))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de reserva no válido o no proporcionado.',
      });
    }

    // 1. Encontrar la reserva para obtener los IDs de sus tablas relacionadas
    const reserva = await db.reserva.findUniqueOrThrow({
      where: { id_reserva: Number(reservaId) },
      select: { 
        id_pago: true, 
        id_detalle_reserva: true 
      },
    });

    const { id_pago, id_detalle_reserva } = reserva;

    // 2. Usar una transacción para eliminar los 3 registros
    // Si algo falla, se revierte todo.
    await db.$transaction([
      // A. Eliminar la reserva principal
      db.reserva.delete({
        where: { id_reserva: Number(reservaId) },
      }),
      
      // B. Eliminar el pago asociado (si existe)
      db.pago.delete({
        where: { id_pago: id_pago ?? 0 },
      }),
      
      // C. Eliminar el detalle de reserva asociado (si existe)
      db.detalle_reserva.delete({
        where: { id_detalle_reserva: id_detalle_reserva ?? 0 },
      }),
    ]);

    // 3. Éxito
    return { 
      statusCode: 200, 
      message: 'Reserva eliminada exitosamente (incluyendo pago y detalle).' 
    };

  } catch (error: any) {
    console.error("Error al eliminar la reserva:", error);
    
    // 4. Capturar si la reserva, pago o detalle no se encontró
    if (error.code === 'P2025') {
      throw createError({ 
        statusCode: 404, 
        statusMessage: 'Error: No se encontró la reserva o sus componentes (pago/detalle) para eliminar.' 
      });
    }

    // 5. Otro error
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Error interno del servidor al eliminar la reserva.' 
    });
  }
});