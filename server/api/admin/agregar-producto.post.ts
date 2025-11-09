// RUTA CORREGIDA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API para CREAR (POST) un nuevo producto.
 * Ruta: /api/admin/agregar-producto
 * Método: POST
 */
export default defineEventHandler(async (event) => {
  try {
    // 1. Leer los datos que vienen del formulario 'agregar-producto.vue'
    const body = await readBody(event);
    
    // Extraemos los datos del formulario
    const { 
      nombre, 
      stock, 
      precio, 
      disponible,
      tipo,
      id_proveedor
    } = body;

    // Validación simple
    if (!nombre || !tipo) {
      throw createError({
        statusCode: 400,
        statusMessage: 'El nombre y el tipo de producto son obligatorios.',
      });
    }

    // 2. Crear el nuevo registro en la tabla 'producto'
    const nuevoProducto = await db.producto.create({
      data: {
        nombre_producto: nombre,
        stock_actual: Number(stock) || 0,
        precio_unitario: Number(precio) || 0,
        disponible: disponible, // boolean
        tipo_producto: tipo, // string
        id_proveedor: id_proveedor ? Number(id_proveedor) : null,
      },
    });

    // 3. Éxito
    return {
      statusCode: 201, // 201 Created
      message: 'Producto creado exitosamente.',
      data: nuevoProducto,
    };

  } catch (error: any) {
    console.error("Error al crear el producto:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al crear el producto.',
    });
  }
});