// RUTA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API de ADMIN para obtener el detalle de UN producto por su ID (para el formulario de edición).
 * Ruta: /api/admin/producto-detalle
 * Método: GET
 * Query Params: ?id= (El ID del producto)
 */
export default defineEventHandler(async (event) => {
  
  // (CORRECCIÓN 1: 'id' se define aquí, fuera del 'try')
  const query = getQuery(event);
  const id = query.id as string | undefined;

  try {
    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de producto inválido o no proporcionado.',
      });
    }

    // 1. Buscar el producto único
    // (No filtramos por 'disponible' para que el admin pueda editarlo)
    const producto = await db.producto.findUniqueOrThrow({
      where: {
        cod_producto: Number(id),
      },
    });

    // 2. Formatear la respuesta para el formulario 'editar-producto.vue'
    const formattedProducto = {
      id: producto.cod_producto,
      nombre: producto.nombre_producto || 'Sin Nombre',
      stock: producto.stock_actual || 0,
      precio: Number(producto.precio_unitario) || 0,
      disponible: producto.disponible || false,
      tipo: producto.tipo_producto || 'Otro',
      id_proveedor: producto.id_proveedor || null,
    };

    return formattedProducto;

  } catch (error: any) {
    console.error("Error al obtener detalle de producto (admin):", error);
    
    // (CORRECCIÓN 2: 'id' ahora SÍ es accesible aquí)
    if (error.code === 'P2025') { // "Registro no encontrado"
       throw createError({ statusCode: 404, statusMessage: `Producto con ID ${id} no encontrado.` });
    }
    
    throw createError({ statusCode: 500, statusMessage: 'Error al consultar el producto.' });
  }
});