// RUTA: Sube un nivel (desde /api/ a /server/)
import { db } from '../utils/prisma';

/**
 * API PÚBLICA para obtener las valoraciones de UN producto.
 * Ruta: /api/valoraciones
 * Método: GET
 * Query Params: ?id= (El ID del producto)
 */
export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);

  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, statusMessage: 'ID de producto inválido' });
  }

  try {
    const valoraciones = await db.valoracion.findMany({
      where: { id_producto: Number(id) },
      orderBy: { fecha_creacion: 'desc' },
      include: {
        // Incluimos el nombre del autor
        usuario: {
          select: { nombre: true, apellido_paterno: true }
        }
      }
    });
    
    // Formateamos los datos para la UI
    return valoraciones.map(v => ({
      id_valoracion: v.id_valoracion,
      rating: v.rating,
      comentario: v.comentario,
      fecha: v.fecha_creacion.toLocaleDateString('es-CL'),
      autor: `${v.usuario.nombre || 'Usuario'} ${v.usuario.apellido_paterno || ''}`.trim()
    }));

  } catch (error) {
    console.error("Error al obtener valoraciones:", error);
    throw createError({ statusCode: 500, statusMessage: 'Error al cargar valoraciones' });
  }
});