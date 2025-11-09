// RUTA CORREGIDA: Sube un nivel (desde /api/ a /server/)
import { db } from '../utils/prisma';
import type { Prisma } from '@prisma/client';

/**
 * API PÚBLICA para listar todos los productos/servicios DISPONIBLES.
 * Ruta: /api/productos
 * Método: GET
 */
export default defineEventHandler(async (event) => {
  try {
    // 1. Ejecutar la consulta
    const productos = await db.producto.findMany({
      where: {
        disponible: true, // ¡Solo mostrar productos disponibles!
      },
      orderBy: {
        nombre_producto: 'asc', // Ordenar alfabéticamente
      },
    });

    // 2. Formatear la respuesta
    const formattedProductos = productos.map((p) => {
      return {
        id: p.cod_producto,
        nombre: p.nombre_producto || 'Sin Nombre',
        precio: Number(p.precio_unitario) || 0,
        tipo: p.tipo_producto || 'Otro',
        // (Podríamos añadir una URL de imagen si la tuvieras en la BD)
      };
    });

    return formattedProductos;

  } catch (error: any) {
    console.error("Error al obtener lista pública de productos:", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al consultar los productos.',
    });
  }
});