// RUTA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API de ADMIN para obtener el detalle de UN memorial por su ID.
 * Ruta: /api/admin/memorial-detalle
 * Método: GET
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const id = query.id as string | undefined;

    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de memorial inválido.',
      });
    }

    const memorial = await db.memorial.findUniqueOrThrow({
      where: { id_memorial: Number(id) },
    });
    
    // Formatear la fecha a YYYY-MM-DD para el <input type="date">
    const formattedMemorial = {
      ...memorial,
      fecha: memorial.fecha.toISOString().split('T')[0],
    };

    return formattedMemorial;
  } catch (error: any) {
    if (error.code === 'P2025') {
       throw createError({ statusCode: 404, statusMessage: 'Memorial no encontrado.' });
    }
    throw createError({ statusCode: 500, statusMessage: 'Error al consultar el memorial.' });
  }
});