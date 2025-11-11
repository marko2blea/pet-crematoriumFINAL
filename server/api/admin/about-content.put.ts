// RUTA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API de ADMIN para ACTUALIZAR (PUT) un bloque de "Nosotros".
 * Ruta: /api/admin/about-content
 * Método: PUT
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id_block, title, body: bodyContent, items } = body; // Renombrado body

    if (!id_block) {
      throw createError({ statusCode: 400, statusMessage: 'Falta el ID del bloque.' });
    }

    const bloqueActualizado = await db.about_block.update({
      where: { id_block: Number(id_block) },
      data: {
        title: title,
        body: bodyContent,
        items: items, // Actualiza el array de items
      },
    });

    return { statusCode: 200, data: bloqueActualizado };
  } catch (error: any) {
    if (error.code === 'P2025') {
       throw createError({ statusCode: 404, statusMessage: 'Bloque no encontrado.' });
    }
    throw createError({ statusCode: 500, statusMessage: 'Error al actualizar.' });
  }
});