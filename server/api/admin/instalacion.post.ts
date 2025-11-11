// RUTA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API de ADMIN para CREAR (POST) una nueva sección de instalación.
 * Ruta: /api/admin/instalacion
 * Método: POST
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Crea la sección con los datos por defecto que envía el botón
    const nuevaSeccion = await db.instalacion.create({
      data: {
        title: body.title || 'Nueva Sección',
        body: body.body || 'Descripción de la sección...',
        features: body.features || ['Nueva característica'],
      },
    });

    return {
      statusCode: 201,
      message: 'Sección creada exitosamente.',
      data: nuevaSeccion,
    };
  } catch (error: any) {
    console.error("Error al crear la sección:", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al crear la sección.',
    });
  }
});