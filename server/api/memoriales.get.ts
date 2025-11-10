// RUTA: Sube un nivel (desde /api/ a /server/)
import { db } from '../utils/prisma';

/**
 * API PÚBLICA para listar todos los memoriales.
 * Ruta: /api/memoriales
 * Método: GET
 */
export default defineEventHandler(async (event) => {
  try {
    const memoriales = await db.memorial.findMany({
      orderBy: {
        fecha: 'desc', // Mostrar los más recientes primero
      },
    });
    return memoriales;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener los memoriales.',
    });
  }
});