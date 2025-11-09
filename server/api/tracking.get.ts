// RUTA CORREGIDA: Sube un nivel (desde /api/ a /server/)
import { db } from '../utils/prisma';

/**
 * API PÚBLICA para que los clientes rastreen sus servicios.
 * Ruta: /api/tracking
 * Método: GET
 * Query Params: ?codigo= (El código de trazabilidad, ej: "ABC-12345")
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const codigo = query.codigo as string | undefined;

    if (!codigo) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Debe proporcionar un código de trazabilidad.',
      });
    }

    // 1. Buscar la reserva por su código
    const reserva = await db.reserva.findFirst({ // Usamos findFirst porque el código no es @unique
      where: {
        cod_trazabilidad: codigo,
      },
      include: {
        pago: { // Necesitamos el pago para saber el estado real
          select: { estado: true }
        },
        usuario: { // Incluir mascota
          select: {
            mascota: {
              select: { nombre_mascota: true }
            }
          }
        }
      },
    });

    // 2. Si no se encuentra
    if (!reserva) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Código no encontrado. Verifique el código e intente de nuevo.',
      });
    }

    // 3. Determinar el estado (Lógica copiada de reservas.get.ts)
    let computedStatus: 'Pendiente' | 'En Proceso' | 'Finalizado' | 'Cancelado' = 'En Proceso';
    if (reserva.pago?.estado === 'Pendiente') {
      computedStatus = 'Pendiente';
    } else if (reserva.pago?.estado === 'Cancelado') {
      computedStatus = 'Cancelado';
    } else if (reserva.estado === true) { // reserva.estado (boolean)
      computedStatus = 'Finalizado';
    }
    
    // 4. Devolver la respuesta
    return {
      codigo: reserva.cod_trazabilidad,
      mascota: reserva.usuario?.mascota?.nombre_mascota || 'Mascota',
      fecha: reserva.fecha_reservada ? new Date(reserva.fecha_reservada).toLocaleDateString('es-CL') : 'N/A',
      estado: computedStatus,
    };

  } catch (error: any) {
    console.error("Error en API de tracking:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor.',
    });
  }
});