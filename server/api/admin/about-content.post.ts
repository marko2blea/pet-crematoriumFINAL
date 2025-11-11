// RUTA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API de ADMIN para CREAR (POST) un nuevo bloque de "Nosotros".
 * Ruta: /api/admin/about-content
 * Método: POST
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    const nuevoBloque = await db.about_block.create({
      data: {
        title: body.title || 'Nuevo Bloque',
        body: body.body || 'Contenido...',
        items: body.items || [], // Array vacío por defecto
      },
    });

    return { statusCode: 201, data: nuevoBloque };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al crear el bloque.',
    });
  }
});