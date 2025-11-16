import { db } from '../../utils/prisma';
export default defineEventHandler(async (event) => {
  try {
    // (MODIFICADO) Añadir 'imagen_url'
    const { id_block, title, body, items, imagen_url } = await readBody(event);

    if (!id_block) {
      throw createError({ statusCode: 400, statusMessage: 'Falta el ID del bloque.' });
    }

    const updatedBlock = await db.about_block.update({
      where: { id_block: Number(id_block) },
      data: {
        title: title,
        body: body,
        items: items,
        imagen_url: imagen_url, // <-- AÑADIDO
      },
    });

    return { statusCode: 200, message: 'Bloque actualizado', data: updatedBlock };
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: 'Bloque no encontrado.' });
    }
    throw createError({ statusCode: 500, statusMessage: 'Error al actualizar.' });
  }
});