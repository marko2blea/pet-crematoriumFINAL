// RUTA CORREGIDA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';
import type { Prisma } from '@prisma/client';

/**
 * API para obtener la lista COMPLETA de productos para el inventario.
 * Ruta: /api/admin/inventario
 * Método: GET
 */
export default defineEventHandler(async (event) => {
  try {
    // 1. Ejecutar la consulta
    const productos = await db.producto.findMany({
      orderBy: {
        nombre_producto: 'asc', // Ordenar alfabéticamente
      },
      include: {
        proveedor: { // Incluir el proveedor relacionado
          select: {
            proveedor: true, // Solo necesitamos el nombre del proveedor
          },
        },
      },
    });

    // 3. Formatear la respuesta para 'inventario.vue'
    const formattedProductos = productos.map((p) => {
      return {
        id: p.cod_producto,
        nombre: p.nombre_producto || 'Sin Nombre',
        proveedorNombre: p.proveedor?.proveedor || 'Sin Proveedor',
        stock: p.stock_actual || 0,
        precio: Number(p.precio_unitario) || 0,
        disponible: p.disponible || false, // true/false
        tipo: p.tipo_producto || 'Otro', // <-- (CAMBIO) Añadir esta línea
      };
    });

    return formattedProductos;

  } catch (error: any) {
    console.error("Error al obtener lista de inventario:", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al consultar el inventario.',
    });
  }
});