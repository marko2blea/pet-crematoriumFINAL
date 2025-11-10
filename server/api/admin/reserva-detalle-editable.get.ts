// RUTA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API para obtener el detalle de UNA reserva para el formulario de edición.
 * Ruta: /api/admin/reserva-detalle-editable
 * Método: GET
 * Query Params: ?id= (El ID de la reserva)
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const id = query.id as string | undefined;

    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de reserva inválido o no proporcionado.',
      });
    }

    // 1. Buscar la reserva
    const reserva = await db.reserva.findUniqueOrThrow({
      where: { id_reserva: Number(id) },
      include: {
        usuario: {
          select: { nombre: true, apellido_paterno: true }
        },
        detalle_reserva: {
          select: { nombre_servicio: true }
        },
        pago: {
          select: { estado: true }
        }
      }
    });

    // 2. Determinar el estado (Lógica copiada de reservas.get.ts)
    let computedStatus: 'Pendiente' | 'En Proceso' | 'Finalizado' | 'Cancelado' = 'En Proceso';
    if (reserva.pago?.estado === 'Pendiente') {
      computedStatus = 'Pendiente';
    } else if (reserva.pago?.estado === 'Cancelado') {
      computedStatus = 'Cancelado';
    } else if (reserva.estado === true) {
      computedStatus = 'Finalizado';
    }
    
    // 3. Formatear la respuesta para el formulario
    return {
      id: reserva.id_reserva,
      cliente: `${reserva.usuario?.nombre || 'Cliente'} ${reserva.usuario?.apellido_paterno || ''}`.trim(),
      servicio: reserva.detalle_reserva?.nombre_servicio || 'N/A',
      codTrazabilidad: reserva.cod_trazabilidad || '',
      
      // Estados para los <select> del formulario
      // (Traducimos el 'computedStatus' de vuelta a los dos estados que lo controlan)
      estadoReserva: reserva.estado ? 'Finalizado' : 'En Proceso', // 'estado' (Boolean)
      estadoPago: reserva.pago?.estado || 'Pendiente' // 'estado' (String)
    };

  } catch (error: any) {
    console.error("Error al obtener detalle de reserva editable:", error);
    if (error.code === 'P2025') { // "Registro no encontrado"
       throw createError({ statusCode: 404, statusMessage: `Reserva no encontrada.` });
    }
    throw createError({ statusCode: 500, statusMessage: 'Error al consultar la reserva.' });
  }
});