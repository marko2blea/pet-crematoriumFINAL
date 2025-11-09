// RUTA CORREGIDA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API para obtener el detalle de UN producto por su ID.
 * Ruta: /api/admin/producto-detalle
 * Método: GET
 * Query Params: ?id= (El ID del producto)
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const id = query.id as string | undefined;

    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de producto inválido o no proporcionado.',
      });
    }

    // 1. Buscar el producto único por su ID
    const producto = await db.producto.findUniqueOrThrow({
      where: {
        cod_producto: Number(id),
      },
      include: {
        proveedor: true, // Incluir toda la info del proveedor
      },
    });

    // 2. Formatear los datos para el formulario 'editar-producto.vue'
    // (Aseguramos que los valores nulos se conviertan a un estado inicial)
    const formattedProducto = {
      id: producto.cod_producto,
      nombre: producto.nombre_producto || '',
      stock: producto.stock_actual || 0,
      precio: Number(producto.precio_unitario) || 0,
      disponible: producto.disponible || false,
      tipo: producto.tipo_producto || 'Urna', // Valor por defecto si es nulo
      id_proveedor: producto.id_proveedor || null,
    };

    return formattedProducto;

  } catch (error: any) {
    console.error("Error al obtener detalle de producto:", error);
    if (error.code === 'P2025') { // Código de Prisma para "Registro no encontrado"
       throw createError({ statusCode: 404, statusMessage: `Producto con ID no encontrado.` });
    }
    throw createError({ statusCode: 500, statusMessage: 'Error al consultar el producto.' });
  }
});