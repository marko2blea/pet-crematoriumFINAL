// RUTA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API de ADMIN para ELIMINAR (DELETE) un memorial.
 * Ruta: /api/admin/eliminar-memorial
 * Método: DELETE
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id } = body;

    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de memorial no válido.',
      });
    }

    await db.memorial.delete({
      where: { id_memorial: Number(id) },
    });

    return { 
      statusCode: 200, 
      message: 'Memorial eliminado exitosamente.' 
    };

  } catch (error: any) {
    if (error.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: 'Memorial no encontrado.' });
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al eliminar.',
    });
  }
});