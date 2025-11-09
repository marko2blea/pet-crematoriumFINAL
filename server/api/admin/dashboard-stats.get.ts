// RUTA CORREGIDA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API para calcular las estadísticas (KPIs) para el Dashboard Admin.
 * Ruta: /api/admin/dashboard-stats
 * Método: GET
 */
export default defineEventHandler(async (event) => {
  try {
    // 1. Contar servicios en proceso
    // (Basado en tu schema, 'estado: false' significa 'En Proceso')
    const pendingServices = await db.reserva.count({
      where: { estado: false },
    });

    // 2. Sumar pagos pendientes
    // (Asumiendo que el estado 'Pendiente' existe en la tabla 'pago')
    const pendingPaymentsResult = await db.pago.aggregate({
      _sum: {
        monto: true,
      },
      where: {
        estado: 'Pendiente', // Ajusta esto si tu estado se llama diferente
      },
    });
    const pendingPayments = pendingPaymentsResult._sum.monto || 0;


    // 3. Contar productos (Urnas) con bajo stock (ej: menos de 5)
    const lowStockItems = await db.producto.count({
      where: {
        tipo_producto: 'Urna',
        stock_actual: {
          lt: 5, // 'lt' = less than (menor que)
        },
      },
    });

    // 4. Devolver los KPIs
    return {
      pendingServices,
      pendingPayments,
      lowStockItems,
    };

  } catch (error: any) {
    console.error("Error al calcular estadísticas del dashboard:", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al calcular estadísticas.',
    });
  }
});