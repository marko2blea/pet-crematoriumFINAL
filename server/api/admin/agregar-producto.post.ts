import { db } from '../../utils/prisma';
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { 
      nombre, tipo, stock, precio, disponible, id_proveedor,
      descripcion, // <-- Nuevo
      imagen_url   // <-- Nuevo
    } = body;

    if (!nombre || !tipo || stock === undefined || !precio) {
      throw createError({ statusCode: 400, statusMessage: 'Faltan campos obligatorios.' });
    }

    const nuevoProducto = await db.producto.create({
      data: {
        nombre_producto: nombre,
        tipo_producto: tipo,
        stock_actual: Number(stock),
        precio_unitario: Number(precio),
        disponible: Boolean(disponible),
        id_proveedor: id_proveedor ? Number(id_proveedor) : null,
        descripcion: descripcion, // <-- Guardar
        imagen_url: imagen_url,   // <-- Guardar
      },
    });

    return { statusCode: 201, message: 'Producto creado.', producto: nuevoProducto };
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw createError({ statusCode: 409, statusMessage: `Ya existe un producto con ese nombre.` });
    }
    throw createError({ statusCode: 500, statusMessage: 'Error al crear el producto.' });
  }
});