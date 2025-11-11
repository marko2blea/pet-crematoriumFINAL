// RUTA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API de ADMIN para ELIMINAR (DELETE) una sección de instalación.
 * Ruta: /api/admin/instalacion
 * Método: DELETE
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // (CORRECCIÓN) Añadimos el tipo explícito al desestructurar
    // Le decimos a TypeScript que esperamos un objeto con esta forma:
    const { id_instalacion }: { id_instalacion: number } = body;

    if (!id_instalacion || isNaN(Number(id_instalacion))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de sección no válido.',
      });
    }

    await db.instalacion.delete({
      where: { id_instalacion: Number(id_instalacion) },
    });

    return { 
      statusCode: 200, 
      message: 'Sección eliminada exitosamente.' 
    };

  } catch (error: any) {
    if (error.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: 'Sección no encontrada.' });
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al eliminar.',
    });
  }
});