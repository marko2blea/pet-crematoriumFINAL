// RUTA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API para ELIMINAR (DELETE) un producto/servicio.
 * Ruta: /api/admin/eliminar-producto
 * Método: DELETE
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id } = body;

    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de producto no válido o no proporcionado.',
      });
    }

    // 1. Intentar eliminar el producto
    await db.producto.delete({
      where: { cod_producto: Number(id) },
    });

    // 2. Éxito
    return { 
      statusCode: 200, 
      message: 'Producto eliminado exitosamente.' 
    };

  } catch (error: any) {
    console.error("Error al eliminar producto:", error);
    
    // 3. (IMPORTANTE) Capturar error de llave foránea
    // Si el producto está en un 'detalle_reserva', Prisma (PostgreSQL)
    // lanzará el error P2003 gracias a tu schema.
    if (error.code === 'P2003') {
      throw createError({
        statusCode: 409, // 409 Conflict
        statusMessage: 'Error: Este producto no se puede eliminar porque está asociado a una o más reservas existentes.'
      });
    }

    // 4. Capturar si el producto no existe
    if (error.code === 'P2025') {
      throw createError({ 
        statusCode: 404, 
        statusMessage: 'Producto no encontrado.' 
      });
    }

    // 5. Otro error
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Error interno del servidor al eliminar el producto.' 
    });
  }
});