import { db } from '../../utils/prisma';
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { 
      id, nombre, stock, precio, disponible, tipo, id_proveedor,
      descripcion, // <-- Nuevo
      imagen_url   // <-- Nuevo
    } = body;

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Falta ID del producto.' });
    }

    const updatedProducto = await db.producto.update({
      where: { cod_producto: Number(id) },
      data: {
        nombre_producto: nombre,
        stock_actual: Number(stock),
        precio_unitario: Number(precio),
        disponible: Boolean(disponible),
        tipo_producto: tipo,
        id_proveedor: id_proveedor ? Number(id_proveedor) : null,
        descripcion: descripcion, // <-- Guardar
        imagen_url: imagen_url,   // <-- Guardar
      },
    });

    return { statusCode: 200, message: 'Producto actualizado', producto: updatedProducto };
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: 'Producto no encontrado.' });
    }
    throw createError({ statusCode: 500, statusMessage: 'Error al actualizar.' });
  }
});