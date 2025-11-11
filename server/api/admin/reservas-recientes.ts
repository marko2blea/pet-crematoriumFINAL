// RUTA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API para obtener la lista de transacciones pagadas recientes.
 * (MODIFICADO) Ahora filtra por período (month, quarter, year) y estado 'Pagado'.
 * Ruta: /api/admin/reservas-recientes
 * Método: GET
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const period = query.period as string || 'month'; // 'month', 'quarter', 'year'

    // 1. (NUEVO) Calcular la fecha de inicio
    const today = new Date();
    let startDate: Date;

    if (period === 'year') {
      startDate = new Date(today.getFullYear(), 0, 1);
    } else if (period === 'quarter') {
      const currentQuarterMonth = Math.floor(today.getMonth() / 3) * 3;
      startDate = new Date(today.getFullYear(), currentQuarterMonth, 1);
    } else {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    // 2. (MODIFICADO) Consulta ahora filtra por 'Pagado' y rango de fechas
    const pagos = await db.pago.findMany({
      where: {
        estado: 'Pagado', // Solo transacciones completadas
        fecha_pago: {
          gte: startDate,
          lte: today,
        },
      },
      include: {
        // Incluir la reserva para obtener el nombre del cliente
        reserva: {
          include: {
            usuario: {
              select: {
                nombre: true,
                apellido_paterno: true,
              },
            },
          },
        },
      },
      orderBy: {
        fecha_pago: 'desc', // Mostrar las más recientes primero
      },
      take: 50, // Limitar a las últimas 50 del período
    });

    // 3. Formatear la respuesta
    const transacciones = pagos.map(pago => {
      // 'reserva' es un array en tu schema, tomamos el primer (y único) usuario
      const usuario = pago.reserva[0]?.usuario;
      const nombreCliente = usuario ? `${usuario.nombre} ${usuario.apellido_paterno}` : 'Usuario Eliminado';
      
      return {
        id: pago.id_pago,
        fecha: pago.fecha_pago ? new Date(pago.fecha_pago).toLocaleDateString('es-CL') : 'N/A',
        cliente: nombreCliente.trim(),
        monto: Number(pago.monto) || 0,
        metodo: pago.nombre_metodo || 'N/A',
      };
    });

    return transacciones;

  } catch (error: any) {
    console.error("Error al obtener transacciones recientes:", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al consultar transacciones.',
    });
  }
});