// RUTA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API para obtener los datos del reporte de ventas (Pagos 'Pagados')
 * (MODIFICADO) Ahora acepta un query param '?period=' (month, quarter, year)
 * Ruta: /api/admin/reporte-ventas
 * Método: GET
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const period = query.period as string || 'month'; // 'month', 'quarter', 'year'

    // 1. (NUEVO) Calcular la fecha de inicio según el período
    const today = new Date();
    let startDate: Date;

    if (period === 'year') {
      // Desde el 1 de enero de este año
      startDate = new Date(today.getFullYear(), 0, 1);
    } else if (period === 'quarter') {
      // Desde el inicio del trimestre actual
      const currentQuarterMonth = Math.floor(today.getMonth() / 3) * 3;
      startDate = new Date(today.getFullYear(), currentQuarterMonth, 1);
    } else {
      // 'month' (o por defecto)
      // Desde el primer día de este mes
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    }
    
    // 2. Consultar los pagos 'Pagados' DENTRO del período
    const pagos = await db.pago.findMany({
      where: {
        estado: 'Pagado',
        fecha_pago: {
          gte: startDate, // Mayor o igual que la fecha de inicio
          lte: today,     // Menor o igual que hoy
        },
      },
      orderBy: {
        fecha_pago: 'asc', // Ordenar por fecha para el gráfico
      },
    });

    // 3. Formatear para el gráfico (sin cambios)
    const formattedPagos = pagos.map(pago => ({
      fecha: pago.fecha_pago ? new Date(pago.fecha_pago).toLocaleDateString('es-CL') : 'Sin Fecha',
      monto: Number(pago.monto) || 0,
    }));
    
    // 4. Agrupar montos por fecha (sin cambios)
    const ventasPorDia = formattedPagos.reduce((acc, pago) => {
      acc[pago.fecha] = (acc[pago.fecha] || 0) + pago.monto;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      labels: Object.keys(ventasPorDia),
      data: Object.values(ventasPorDia),
      total: Object.values(ventasPorDia).reduce((sum, monto) => sum + monto, 0),
    };

  } catch (error: any) {
    console.error("Error al obtener reporte de ventas:", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al consultar el reporte.',
    });
  }
});