// RUTA CORREGIDA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API para obtener la lista de transacciones COMPLETADAS (Pagadas).
 * Ruta: /api/admin/reporte-ventas
 * Método: GET
 */
export default defineEventHandler(async (event) => {
  try {
    // 1. Buscar todos los pagos que estén 'Pagado'
    const pagosCompletados = await db.pago.findMany({
      where: {
        estado: 'Pagado', // Solo queremos los pagos exitosos
      },
      orderBy: {
        fecha_pago: 'desc', // Los más recientes primero
      },
      include: {
        // Incluimos la 'reserva' asociada a este pago
        reserva: {
          include: {
            // Y de la reserva, incluimos el 'usuario' (cliente)
            usuario: {
              select: {
                nombre: true,
                apellido_paterno: true,
              },
            },
            // Y el 'detalle_reserva' (servicio)
            detalle_reserva: {
              select: {
                nombre_servicio: true,
              },
            },
          },
        },
      },
    });

    // 2. Formatear la respuesta para 'reportes.vue'
    const formattedReporte = pagosCompletados.map((pago) => {
      // Como 'pago' y 'reserva' tienen una relación 1-a-muchos (un pago puede tener muchas reservas)
      // tomamos la primera reserva asociada (en tu schema es 1-a-1, así que 'pago.reserva[0]' está bien)
      const reservaAsociada = pago.reserva[0]; 
      
      return {
        id_pago: pago.id_pago,
        fecha: pago.fecha_pago ? new Date(pago.fecha_pago).toLocaleDateString('es-CL') : 'N/A',
        cliente: `${reservaAsociada?.usuario?.nombre || 'Cliente'} ${reservaAsociada?.usuario?.apellido_paterno || ''}`.trim(),
        servicio: reservaAsociada?.detalle_reserva?.nombre_servicio || 'N/A',
        metodo: pago.nombre_metodo || 'N/A',
        monto: Number(pago.monto) || 0,
      };
    });
    
    // 3. Calcular el total de ventas
    const totalVentas = formattedReporte.reduce((sum, item) => sum + item.monto, 0);

    return {
      transacciones: formattedReporte,
      totalVentas: totalVentas,
    };

  } catch (error: any) {
    console.error("Error al generar reporte de ventas:", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al consultar el reporte.',
    });
  }
});