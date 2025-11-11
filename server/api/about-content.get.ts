// RUTA: Sube un nivel (desde /api/ a /server/)
import { db } from '../utils/prisma';

/**
 * API PÚBLICA para listar todos los bloques de "Nosotros".
 * Ruta: /api/about-content
 * Método: GET
 */
export default defineEventHandler(async (event) => {
  try {
    const bloques = await db.about_block.findMany({
      orderBy: {
        orden: 'asc', // Ordenar por el campo 'orden'
      },
    });
    return bloques;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener el contenido de "Nosotros".',
    });
  }
});