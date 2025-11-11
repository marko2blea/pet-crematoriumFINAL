// RUTA: Sube dos niveles (desde /api/usuario/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API para que un usuario actualice SU PROPIO perfil.
 * Ruta: /api/usuario/editar-perfil
 * Método: PUT
 */
export default defineEventHandler(async (event) => {
  try {
    const { 
      id_usuario, 
      nombre, 
      apellido_paterno, 
      apellido_materno,
      telefono,
      region,
      comuna,
      direccion
    } = await readBody(event);

    if (!id_usuario) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de usuario no proporcionado.',
      });
    }

    // 1. Actualizar la información del usuario en la BD
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
        direccion
      },
      // 2. Devolver solo los datos seguros (sin contraseña)
      select: {
        id_usuario: true,
        nombre: true,
        apellido_paterno: true,
        apellido_materno: true,
        correo: true,
        telefono: true,
        region: true,
        comuna: true,
        direccion: true,
        id_rol: true,
      }
    });

    // 3. Éxito
    return { 
      statusCode: 200, 
      message: 'Perfil actualizado exitosamente.',
      user: usuarioActualizado // Devuelve el usuario actualizado para el composable 'useUser'
    };

  } catch (error: any) {
    console.error("Error al actualizar perfil:", error);
    
    if (error.code === 'P2025') {
      throw createError({ 
        statusCode: 404, 
        statusMessage: 'Usuario no encontrado.' 
      });
    }

    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Error interno del servidor al actualizar el perfil.' 
    });
  }
});