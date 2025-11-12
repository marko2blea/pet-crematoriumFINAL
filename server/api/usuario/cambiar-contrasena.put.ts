// RUTA: Sube dos niveles (desde /api/usuario/ a /server/)
import { db } from '../../utils/prisma';
import bcrypt from 'bcryptjs';
import type { User } from '../../../app/types';

/**
 * API para que un usuario actualice SU PROPIA contraseña.
 * Ruta: /api/usuario/cambiar-contrasena
 * Método: PUT
 */
export default defineEventHandler(async (event) => {
  try {
    const { 
      id_usuario, 
      currentPassword, // Contraseña actual
      newPassword      // Contraseña nueva
    } = await readBody(event);

    if (!id_usuario || !currentPassword || !newPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Faltan datos (ID, contraseña actual y contraseña nueva).',
      });
    }

    // 1. Buscar al usuario y su contraseña actual
    const usuario = await db.usuario.findUnique({
      where: { id_usuario: Number(id_usuario) },
    });

    if (!usuario || !usuario.contrase_a) {
      throw createError({ statusCode: 404, statusMessage: 'Usuario no encontrado.' });
    }

    // 2. Comparar la contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, usuario.contrase_a);

    if (!isMatch) {
      throw createError({
        statusCode: 403, // 403 Forbidden
        statusMessage: 'La contraseña actual es incorrecta.',
      });
    }

    // 3. Hashear la nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 4. Actualizar la contraseña en la BD
    await db.usuario.update({
      where: { id_usuario: Number(id_usuario) },
      data: {
        contrase_a: hashedNewPassword,
      },
    });

    // 5. Éxito
    return { 
      statusCode: 200, 
      message: 'Contraseña actualizada exitosamente.'
    };

  } catch (error: any) {
    // Si el error ya tiene un statusCode (como 403 o 404), relanzarlo
    if (error.statusCode) throw error; 

    console.error("Error al cambiar contraseña:", error);
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Error interno del servidor al cambiar la contraseña.' 
    });
  }
});