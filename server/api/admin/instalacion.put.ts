// RUTA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API de ADMIN para ACTUALIZAR (PUT) una sección de instalación.
 * Ruta: /api/admin/instalacion
 * Método: PUT
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event); 
    
    // (CORRECCIÓN) Renombramos 'body' a 'bodyContent' para evitar conflicto
    const { id_instalacion, title, body: bodyContent, features } = body;

    if (!id_instalacion) {
      throw createError({ statusCode: 400, statusMessage: 'Falta el ID de la sección.' });
    }

    const seccionActualizada = await db.instalacion.update({
      where: { id_instalacion: Number(id_instalacion) },
      data: {
        title: title,
        body: bodyContent, // Usamos la variable renombrada
        features: features,
      },
    });

    return {
      statusCode: 200,
      message: 'Sección actualizada exitosamente.',
      data: seccionActualizada,
    };
  } catch (error: any) {
    if (error.code === 'P2025') {
       throw createError({ statusCode: 404, statusMessage: 'Sección no encontrada.' });
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al actualizar.',
    });
  }
});