// RUTA: Sube un nivel (desde /api/ a /server/)
import { db } from '../utils/prisma';

/**
 * API PÚBLICA para obtener el detalle de UN producto por su ID.
 * (MODIFICADO) Ahora incluye stock, proveedor, descripción e imagen.
 * Ruta: /api/producto
 * Método: GET
 * Query Params: ?id= (El ID del producto)
 */
export default defineEventHandler(async (event) => {
  
  // (CORRECCIÓN 1) 'id' se define aquí, fuera del 'try'
  const query = getQuery(event);
  const id = query.id as string | undefined;

  try {
    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de producto inválido o no proporcionado.',
      });
    }

    // 1. (MODIFICADO) Buscar el producto e incluir el proveedor
    const producto = await db.producto.findUniqueOrThrow({
      where: {
        cod_producto: Number(id),
        disponible: true, // ¡Solo productos disponibles!
      },
      include: {
        proveedor: { // Incluir el nombre del proveedor
          select: {
            proveedor: true
          }
        }
      }
    });

    // 2. (MODIFICADO) Formatear la respuesta con todos los datos
    const formattedProducto = {
      id: producto.cod_producto,
      nombre: producto.nombre_producto || 'Sin Nombre',
      precio: Number(producto.precio_unitario) || 0,
      tipo: producto.tipo_producto || 'Otro',
      // --- Nuevos campos ---
      descripcion: producto.descripcion || 'Este producto no tiene una descripción disponible.',
      stock: producto.stock_actual || 0,
      disponible: producto.disponible || false,
      proveedor: producto.proveedor?.proveedor || 'San Antonio', // Default si no hay proveedor
      imagen_url: producto.imagen_url || null
    };

    return formattedProducto;

  } catch (error: any) {
    console.error("Error al obtener detalle de producto público:", error);
    
    // (CORRECCIÓN 2) 'id' ahora SÍ es accesible aquí
    if (error.code === 'P2025') { // "Registro no encontrado"
       throw createError({ statusCode: 404, statusMessage: `Producto no disponible o no encontrado (ID: ${id}).` });
    }
    
    throw createError({ statusCode: 500, statusMessage: 'Error al consultar el producto.' });
  }
});