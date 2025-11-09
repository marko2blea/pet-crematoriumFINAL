// RUTA CORREGIDA: Sube un nivel (desde /api/ a /server/)
import { db } from '../utils/prisma';
import type { CartItem } from '../../app/types'; // Importamos el tipo del carrito

/**
 * API para procesar el CHECKOUT (Crear la reserva final).
 * Ruta: /api/checkout
 * Método: POST
 */
export default defineEventHandler(async (event) => {
  try {
    // 1. Leer los datos que vienen del formulario 'reserva.vue'
    const body = await readBody(event);
    
    // Extraemos los 4 componentes del body
    const { 
      formData,  // { petName, petWeight, petAge, region, comuna, direccion, metodoPago }
      cartItems, // Array de CartItem[]
      cartTotal, // Número (Subtotal)
      userId     // Número (ID del usuario logueado)
    } = body;

    // 2. Validaciones
    if (!userId || !cartItems || (cartItems as CartItem[]).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Faltan datos de usuario o el carrito está vacío.',
      });
    }
    if (!formData.petName || !formData.region || !formData.comuna || !formData.direccion) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Faltan datos de la mascota o dirección.',
      });
    }

    // 3. Iniciar una transacción de Prisma
    // Esto asegura que si una consulta falla, todas fallan (atomicidad)
    const transactionResult = await db.$transaction(async (tx) => {
      
      // 3.1. Crear la Mascota
      // (Asumimos id_especie=1 (Perro) por ahora, ya que el form no lo pide)
      const nuevaMascota = await tx.mascota.create({
        data: {
          nombre_mascota: formData.petName,
          peso: Number(formData.petWeight) || 0,
          edad: Number(formData.petAge) || 0,
          id_especie: 1, 
        },
      });

      // 3.2. Actualizar el Usuario para enlazar esta nueva mascota
      // (Siguiendo tu schema, esto sobrescribirá el id_mascota anterior del usuario)
      await tx.usuario.update({
        where: { id_usuario: Number(userId) },
        data: { id_mascota: nuevaMascota.id_mascota },
      });

      // 3.3. Crear el Detalle de la Reserva (Resumen del carrito)
      const servicioNombre = (cartItems as CartItem[]).map(item => item.nombre).join(' + ');
      const totalItems = (cartItems as CartItem[]).reduce((sum, item) => sum + item.quantity, 0);
      const totalConIVA = cartTotal * 1.19; // Total final

      const nuevoDetalle = await tx.detalle_reserva.create({
        data: {
          nombre_servicio: servicioNombre,
          precio_servicio: cartTotal, // Subtotal
          tipo_servicio: (cartItems as CartItem[])[0]?.tipo || 'Servicio',
          desc_servicio: `${totalItems} items en el pedido.`,
          cantidad: totalItems,
          precio_total: totalConIVA,
          cod_producto: (cartItems as CartItem[])[0]?.id ? Number((cartItems as CartItem[])[0].id) : null,
        },
      });

      // 3.4. Crear el Pago (marcado como 'Pendiente')
      // (Asumimos id_metodo=1 (Transferencia) por ahora)
      const nuevoPago = await tx.pago.create({
        data: {
          nombre_metodo: formData.metodoPago || 'Transferencia Bancaria',
          fecha_pago: new Date(),
          monto: totalConIVA,
          estado: 'Pendiente', // El admin debe aprobarlo
          id_metodo: 1, 
        },
      });

      // 3.5. Generar Código de Trazabilidad (Ej: "A5B-CDE12")
      const cod_trazabilidad = `${Math.random().toString(36).substr(2, 3).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // 3.6. Crear la Reserva FINAL
      const nuevaReserva = await tx.reserva.create({
        data: {
          cod_trazabilidad: cod_trazabilidad,
          fecha_reservada: new Date(),
          hora_reservada: new Date(),
          region: formData.region,
          comuna: formData.comuna,
          direccion: formData.direccion,
          precio_total: totalConIVA,
          estado: false, // false = "En Proceso"
          id_usuario: Number(userId),
          id_pago: nuevoPago.id_pago,
          id_detalle_reserva: nuevoDetalle.id_detalle_reserva,
          // id_cementerio queda nulo (no se selecciona en este flujo)
        },
      });
      
      // 3.7. Devolver el código de trazabilidad
      return {
        trackingCode: nuevaReserva.cod_trazabilidad,
        reservaId: nuevaReserva.id_reserva
      };
    }); // Fin de la transacción

    // 4. Éxito: Devolver el resultado de la transacción
    return transactionResult;

  } catch (error: any) {
    console.error("Error en API de checkout:", error);
    if (error.statusCode) {
      throw error;
    }
    // Error de Prisma (ej: un 'id_especie' que no existe)
    if (error.code) {
       throw createError({ statusCode: 500, statusMessage: `Error de base de datos: ${error.message}` });
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al procesar la reserva.',
    });
  }
});