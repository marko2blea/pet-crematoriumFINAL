// RUTA: Sube un nivel (desde /api/ a /server/)
import { db } from '../utils/prisma';

/**
 * API (Protegida) para ENVIAR una valoración.
 * Ruta: /api/valoraciones
 * Método: POST
 */
export default defineEventHandler(async (event) => {
  // Obtenemos los datos del body
  const { id_producto, id_usuario, rating, comentario } = await readBody(event);

  if (!id_producto || !id_usuario || !rating) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan datos (producto, usuario o rating)' });
  }

  try {
    // Verificamos si el usuario ya valoró este producto (basado en el @@unique del schema)
    const existing = await db.valoracion.findUnique({
      where: {
        id_producto_id_usuario: { // Prisma genera este identificador para el @@unique
          id_producto: Number(id_producto),
          id_usuario: Number(id_usuario)
        }
      }
    });

    if (existing) {
      throw createError({ statusCode: 409, statusMessage: 'Ya has enviado una valoración para este producto.' });
    }

    // Creamos la nueva valoración
    const nuevaValoracion = await db.valoracion.create({
      data: {
        id_producto: Number(id_producto),
        id_usuario: Number(id_usuario),
        rating: Number(rating),
        comentario: comentario,
      }
    });

    return { statusCode: 201, message: 'Valoración enviada con éxito' };

  } catch (error: any) {
    if (error.statusCode === 409) throw error; // Re-lanzar el error "409 Conflict"
    
    console.error("Error al enviar valoración:", error);
    throw createError({ statusCode: 500, statusMessage: 'Error al guardar la valoración' });
  }
});