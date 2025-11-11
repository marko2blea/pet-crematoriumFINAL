// RUTA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API para obtener el reporte de SERVICIOS más vendidos (basado en pagos 'Pagados').
 * Acepta un query param '?period=' (month, quarter, year)
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

    // 2. Encontrar todos los 'detalles' de reservas que sean 'Servicios' y estén 'Pagadas'
    const detallesVendidos = await db.detalle_reserva.findMany({
      where: {
        // (MODIFICADO) El producto es de tipo 'Servicio'
        producto: {
          tipo_producto: 'Servicio'
        },
        // B. La reserva asociada tiene un pago 'Pagado' Y está dentro del rango de fechas
        reserva: {
          some: { 
            pago: {
              estado: 'Pagado',
              fecha_pago: {
                gte: startDate,
                lte: today,
              },
            }
          }
        }
      },
      select: {
        cantidad: true,
        producto: { 
          select: { nombre_producto: true }
        }
      }
    });

    // 3. Agregar los datos en TypeScript
    const stats = new Map<string, number>();
    for (const detalle of detallesVendidos) {
      const nombre = detalle.producto?.nombre_producto || 'Servicio Desconocido';
      const cantidad = detalle.cantidad || 0;
      stats.set(nombre, (stats.get(nombre) || 0) + cantidad);
    }

    // 4. Formatear para la UI
    const formattedData = Array.from(stats.entries())
      .map(([nombre, ventas]) => ({ nombre, ventas }))
      .sort((a, b) => b.ventas - a.ventas); // Ordenar de más vendido a menos vendido

    return formattedData;

  } catch (error: any) {
    console.error("Error al obtener reporte de servicios:", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al consultar el reporte de servicios.',
    });
  }
});