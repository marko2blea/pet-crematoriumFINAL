// RUTA CORREGIDA: Ahora sube dos niveles (../../) para encontrar /utils/
import { db } from '../../utils/prisma';
import bcrypt from 'bcryptjs';

/**
 * API para iniciar sesión de un usuario.
 * Ruta: /api/auth/login
 * Método: POST
 */
export default defineEventHandler(async (event) => {
  try {
    // 1. Leer los datos que vienen del formulario (ej: de login.vue)
    const body = await readBody(event);
    const { correo, contraseña } = body;

    if (!correo || !contraseña) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Correo y contraseña son obligatorios.',
      });
    }

    // 2. Buscar al usuario por su correo (ESTA PARTE FALTABA)
    const user = await db.usuario.findUnique({
      where: { correo: correo },
    });

    // 3. Si el usuario no existe
    if (!user) {
      throw createError({
        statusCode: 401, // 401 Unauthorized
        statusMessage: 'Credenciales inválidas (usuario no encontrado).',
      });
    }

    // 4. Comparar la contraseña del formulario con la encriptada en la BD
    // Nota: 'user.contrase_a' debe coincidir con el campo en tu schema.prisma
    const isPasswordValid = await bcrypt.compare(contraseña, user.contrase_a || '');

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401, // 401 Unauthorized
        statusMessage: 'Credenciales inválidas (contraseña incorrecta).',
      });
    }

    // 5. Éxito: Devolver el usuario (SIN la contraseña)
    const { contrase_a, ...userWithoutPassword } = user;

    return {
      statusCode: 200,
      message: 'Inicio de sesión exitoso.',
      user: userWithoutPassword
      // Aquí es donde normalmente generarías un Token (JWT)
    };

  } catch (error: any) {
    console.error("Error en API login:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor.',
    });
  }
});