// RUTA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API de ADMIN para ACTUALIZAR (PUT) los DATOS PERSONALES y el ROL de un usuario.
 * Ruta: /api/admin/editar-usuario
 * Método: PUT
 */
export default defineEventHandler(async (event) => {
  try {
    // (REVERTIDO) Volvemos a incluir 'id_rol'
    const { 
      id_usuario, 
      nombre, 
      apellido_paterno, 
      apellido_materno,
      telefono,
      region,
      comuna,
      direccion,
      id_rol // <-- Campo de Rol
    } = await readBody(event);

    if (!id_usuario) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de usuario no proporcionado.',
      });
    }

    // 1. Actualizar la información del usuario en la BD
    // (REVERTIDO) 'id_rol' ha sido AÑADIDO DE VUELTA a la consulta 'data'
    const usuarioActualizado = await db.usuario.update({
      where: {
        id_usuario: Number(id_usuario),
      },
      data: {
        nombre,
        apellido_paterno,
        apellido_materno,
        telefono,
        region,
        comuna,
        direccion,
        id_rol: Number(id_rol) // <-- Actualiza el Rol
      },
    });

    // 2. Éxito
    return { 
      statusCode: 200, 
      message: 'Usuario actualizado exitosamente.',
      user: usuarioActualizado
    };

  } catch (error: any) {
    console.error("Error al actualizar usuario:", error);
    
    // Capturar si el usuario no existe
    if (error.code === 'P2025') {
      throw createError({ 
        statusCode: 404, 
        statusMessage: 'Usuario no encontrado.' 
      });
    }

    // Otro error
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Error interno del servidor al actualizar el usuario.' 
    });
  }
});