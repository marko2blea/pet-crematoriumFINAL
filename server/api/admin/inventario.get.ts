// RUTA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API para listar el inventario (Paginado)
 * Ruta: /api/admin/inventario
 * Método: GET
 * Query Params: ?page= (Opcional, número de página)
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const page = Number(query.page) || 1;
    const limit = 10; // (Req. 2) Mostrar 10 productos por página
    const skip = (page - 1) * limit;

    // (Req. 2) Hacemos dos consultas en una transacción
    const [productos, totalCount] = await db.$transaction([
      // Consulta 1: Obtener los productos de la página actual
      db.producto.findMany({
        skip: skip,
        take: limit,
        orderBy: { nombre_producto: 'asc' },
        include: {
          proveedor: {
            select: { proveedor: true }
          }
        }
      }),
      // Consulta 2: Obtener el conteo total
      db.producto.count()
    ]);

    // 3. Formatear la respuesta
    const formattedProductos = productos.map(p => ({
      id: p.cod_producto,
      nombre: p.nombre_producto || 'Sin Nombre',
      stock: p.stock_actual || 0,
      precio: Number(p.precio_unitario) || 0,
      disponible: p.disponible || false,
      tipo: p.tipo_producto || 'Otro',
      proveedor: p.proveedor?.proveedor || 'N/A'
    }));

    // 4. Devolver los productos Y el conteo total
    return {
      productos: formattedProductos,
      totalCount: totalCount
    };

  } catch (error: any) {
    console.error("Error al obtener inventario:", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al consultar el inventario.',
    });
  }
});