// RUTA CORREGIDA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API para ACTUALIZAR (PUT) una reserva existente.
 * Ruta: /api/admin/editar-reserva
 * Método: PUT
 */
export default defineEventHandler(async (event) => {
  try {
    // 1. Leer los datos que vienen del formulario 'editar-reserva.vue'
    const body = await readBody(event);
    
    // Extraemos los datos del formulario (form.id, form.estadoReserva, etc.)
    const { 
      id: reservaId, 
      estadoReserva, 
      estadoPago, 
      codTrazabilidad 
    } = body;

    if (!reservaId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de reserva no proporcionado.',
      });
    }

    // 2. Traducir los estados del formulario a los valores de la BD
    // 'estadoReserva' (Frontend) -> 'estado' (BD - Boolean)
    const nuevoEstadoReserva = estadoReserva === 'Finalizado'; // true si es 'Finalizado', false si es 'En Proceso'

    // 3. Obtener el ID del pago asociado a esta reserva
    // Necesitamos esto para actualizar la tabla 'pago' por separado.
    const reserva = await db.reserva.findUnique({
      where: { id_reserva: Number(reservaId) },
      select: { id_pago: true } // Solo necesitamos saber el id_pago
    });

    if (!reserva || !reserva.id_pago) {
      throw createError({ statusCode: 404, statusMessage: 'Reserva o pago asociado no encontrado.' });
    }

    // 4. Usar una transacción de Prisma para actualizar AMBAS tablas
    // Esto asegura que si una actualización falla, la otra también se revierte.
    const [reservaActualizada, pagoActualizado] = await db.$transaction([
      
      // Operación 1: Actualizar la tabla 'reserva'
      db.reserva.update({
        where: { id_reserva: Number(reservaId) },
        data: {
          estado: nuevoEstadoReserva, // El boolean
          cod_trazabilidad: codTrazabilidad, // El string
        },
      }),

      // Operación 2: Actualizar la tabla 'pago'
      db.pago.update({
        where: { id_pago: reserva.id_pago },
        data: {
          estado: estadoPago, // El string ('Pagado', 'Pendiente', 'Cancelado')
        },
      }),
    ]);

    // 5. Éxito
    return {
      statusCode: 200,
      message: 'Reserva actualizada exitosamente.',
      data: reservaActualizada,
    };

  } catch (error: any) {
    console.error("Error al actualizar la reserva:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al actualizar la reserva.',
    });
  }
});