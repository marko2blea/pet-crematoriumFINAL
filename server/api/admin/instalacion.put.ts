import { db } from '../../utils/prisma';
export default defineEventHandler(async (event) => {
  try {
    const { id_instalacion, title, body, features, imagen_url } = await readBody(event);
    if (!id_instalacion) throw createError({ statusCode: 400, statusMessage: 'Falta ID.' });
    
    const updated = await db.instalacion.update({
      where: { id_instalacion: Number(id_instalacion) },
      data: { 
        title, 
        body, 
        features,
        imagen_url // <-- Asegúrate de que esto esté
      },
    });
    return { statusCode: 200, data: updated };
  } catch (error: any) {
    if (error.code === 'P2025') throw createError({ statusCode: 404, statusMessage: 'No encontrada.' });
    throw createError({ statusCode: 500, statusMessage: 'Error al actualizar.' });
  }
});