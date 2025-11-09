// RUTA CORREGIDA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API para ACTUALIZAR (PUT) un producto existente.
 * Ruta: /api/admin/editar-producto
 * Método: PUT
 */
export default defineEventHandler(async (event) => {
  try {
    // 1. Leer los datos que vienen del formulario 'editar-producto.vue'
    const body = await readBody(event);
    
    // Extraemos los datos del formulario
    const { 
      id, 
      nombre, 
      stock, 
      precio, 
      disponible,
      tipo,
      id_proveedor
    } = body;

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de producto no proporcionado.',
      });
    }

    // 2. Actualizar la tabla 'producto'
    const productoActualizado = await db.producto.update({
      where: { cod_producto: Number(id) },
      data: {
        nombre_producto: nombre,
        stock_actual: Number(stock), // Asegurar que sea número
        precio_unitario: Number(precio), // Asegurar que sea número
        disponible: disponible, // boolean
        tipo_producto: tipo, // string
        id_proveedor: id_proveedor ? Number(id_proveedor) : null, // ID del proveedor
      },
    });

    // 3. Éxito
    return {
      statusCode: 200,
      message: 'Producto actualizado exitosamente.',
      data: productoActualizado,
    };

  } catch (error: any) {
    console.error("Error al actualizar el producto:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al actualizar el producto.',
    });
  }
});