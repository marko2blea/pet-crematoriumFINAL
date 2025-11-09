// RUTA CORREGIDA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API para ACTUALIZAR (PUT) el ROL de un usuario.
 * Ruta: /api/admin/editar-usuario
 * Método: PUT
 */
export default defineEventHandler(async (event) => {
  try {
    // 1. Leer los datos que vienen del formulario
    const body = await readBody(event);
    const { id: usuarioId, id_rol: nuevoRolId } = body;

    if (!usuarioId || !nuevoRolId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Faltan el ID de usuario o el ID de rol.',
      });
    }

    // 2. Actualizar la tabla 'usuario'
    const usuarioActualizado = await db.usuario.update({
      where: { id_usuario: Number(usuarioId) },
      data: {
        id_rol: Number(nuevoRolId), // Actualizamos el ID del rol
      },
    });

    // 3. Éxito
    return {
      statusCode: 200,
      message: 'Rol de usuario actualizado exitosamente.',
      data: usuarioActualizado,
    };

  } catch (error: any) {
    console.error("Error al actualizar el rol del usuario:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al actualizar el rol.',
    });
  }
});