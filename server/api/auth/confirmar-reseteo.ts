import { db } from '../../utils/prisma';
import bcrypt from 'bcryptjs';

/**
 * API para confirmar el reseteo de contraseña.
 * Valida el token y actualiza la contraseña.
 * Ruta: /api/auth/confirmar-reseteo
 * Método: PUT
 */
export default defineEventHandler(async (event) => {
  try {
    const { token, password }: { token: string; password: string } = await readBody(event);

    if (!token || !password) {
      throw createError({ statusCode: 400, statusMessage: 'Faltan datos.' });
    }

    // 1. Buscar al usuario por el token
    const usuario = await db.usuario.findUnique({
      where: { reset_token: token },
    });

    // 2. Validar token
    if (!usuario) {
      throw createError({ statusCode: 404, statusMessage: 'Token no válido.' });
    }

    // 3. Validar expiración
    if (!usuario.reset_token_expires || usuario.reset_token_expires < new Date()) {
      throw createError({ statusCode: 400, statusMessage: 'El token ha expirado.' });
    }

    // 4. Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Actualizar la contraseña y limpiar los campos de reseteo
    await db.usuario.update({
      where: { id_usuario: usuario.id_usuario },
      data: {
        contrase_a: hashedPassword,
        reset_token: null, // Limpiar el token
        reset_token_expires: null, // Limpiar la expiración
      },
    });

    return { message: 'Contraseña actualizada con éxito.' };

  } catch (error: any) {
    // Si el error ya fue manejado (400, 404) lo relanza
    if (error.statusCode) throw error; 
    
    console.error("Error al confirmar reseteo:", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor.',
    });
  }
});