// RUTA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API para obtener el reporte de SERVICIOS más vendidos (basado en pagos 'Pagados').
 * (MODIFICADO) Usa una consulta más simple para evitar el error 500.
 * Ruta: /api/admin/reporte-servicios
 * Método: GET
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const period = query.period as string || 'month'; // 'month', 'quarter', 'year'

    // 1. Calcular la fecha de inicio
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

    // 2. (CORREGIDO) Consulta más simple: Empezar desde los Pagos
    const pagos = await db.pago.findMany({
      where: {
        estado: 'Pagado',
        fecha_pago: {
          gte: startDate,
          lte: today,
        },
      },
      include: {
        // Un pago tiene múltiples reservas (aunque en tu caso es 1 a 1)
        reserva: {
          include: {
            // La reserva tiene un detalle
            detalle_reserva: {
              include: {
                // El detalle tiene un producto
                producto: {
                  select: {
                    nombre_producto: true,
                    tipo_producto: true // Necesitamos el tipo para filtrar
                  }
                }
              }
            }
          }
        }
      }
    });

    // 3. Agregar los datos en TypeScript
    const stats = new Map<string, number>();
    for (const pago of pagos) {
      for (const reserva of pago.reserva) {
        const detalle = reserva.detalle_reserva;
        // (CORREGIDO) Filtrar aquí por 'Servicio'
        if (detalle && detalle.producto?.tipo_producto === 'Servicio') {
          const nombre = detalle.producto.nombre_producto || 'Servicio Desconocido';
          const cantidad = detalle.cantidad || 0;
          stats.set(nombre, (stats.get(nombre) || 0) + cantidad);
        }
      }
    }

    // 4. Formatear para la UI
    const formattedData = Array.from(stats.entries())
      .map(([nombre, ventas]) => ({ nombre, ventas }))
      .sort((a, b) => b.ventas - a.ventas); 

    return formattedData;

  } catch (error: any) {
    console.error("Error al obtener reporte de servicios:", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al consultar el reporte de servicios.',
    });
  }
});