import { db } from '../../utils/prisma';
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id as string | undefined;
  try {
    if (!id || isNaN(Number(id))) {
      throw createError({ statusCode: 400, statusMessage: 'ID inválido.' });
    }
    const producto = await db.producto.findUniqueOrThrow({
      where: { cod_producto: Number(id) },
    });
    
    // (MODIFICADO) Asegurarse de devolver los nuevos campos
    return {
      id: producto.cod_producto,
      nombre: producto.nombre_producto || 'Sin Nombre',
      stock: producto.stock_actual || 0,
      precio: Number(producto.precio_unitario) || 0,
      disponible: producto.disponible || false,
      tipo: producto.tipo_producto || 'Otro',
      id_proveedor: producto.id_proveedor || null,
      descripcion: producto.descripcion || '', // <-- Nuevo
      imagen_url: producto.imagen_url || null // <-- Nuevo
    };

  } catch (error: any) {
    if (error.code === 'P2025') {
       throw createError({ statusCode: 404, statusMessage: `Producto con ID ${id} no encontrado.` });
    }
    throw createError({ statusCode: 500, statusMessage: 'Error al consultar el producto.' });
  }
});