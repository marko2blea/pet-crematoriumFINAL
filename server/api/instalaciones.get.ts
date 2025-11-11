// RUTA: Sube un nivel (desde /api/ a /server/)
import { db } from '../utils/prisma';

/**
 * API PÚBLICA para listar todas las secciones de instalaciones.
 * Ruta: /api/instalaciones
 * Método: GET
 */
export default defineEventHandler(async (event) => {
  try {
    const secciones = await db.instalacion.findMany({
      orderBy: {
        orden: 'asc', // Ordenar por el campo 'orden'
      },
    });
    return secciones;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener las secciones de instalaciones.',
    });
  }
});