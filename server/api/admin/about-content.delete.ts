// RUTA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API de ADMIN para ELIMINAR (DELETE) un bloque de "Nosotros".
 * Ruta: /api/admin/about-content
 * Método: DELETE
 */
export default defineEventHandler(async (event) => {
  try {
    const { id_block }: { id_block: number } = await readBody(event);

    if (!id_block || isNaN(Number(id_block))) {
      throw createError({ statusCode: 400, statusMessage: 'ID de bloque no válido.' });
    }

    await db.about_block.delete({
      where: { id_block: Number(id_block) },
    });

    return { statusCode: 200, message: 'Bloque eliminado exitosamente.' };
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: 'Bloque no encontrado.' });
    }
    throw createError({ statusCode: 500, statusMessage: 'Error al eliminar.' });
  }
});