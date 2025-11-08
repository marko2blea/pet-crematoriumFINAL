// RUTA CORREGIDA: Cambiamos '~/server/utils/prisma' por la ruta relativa '../utils/prisma'
import { db } from '../../utils/prisma';
import bcrypt from 'bcryptjs';

/**
 * API para registrar un nuevo usuario.
 * Ruta: /api/register
 * Método: POST
 */
export default defineEventHandler(async (event) => {
  try {
    // 1. Leer los datos que vienen del formulario (ej: de registro.vue)
    const body = await readBody(event);
    const { nombre, apellido_paterno, correo, contraseña } = body;

    // 2. Validar datos básicos
    if (!correo || !contraseña || !nombre) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Faltan campos obligatorios (nombre, correo, contraseña).',
      });
    }

    // 3. Revisar si el usuario ya existe
    const existingUser = await db.usuario.findUnique({
      where: { correo: correo },
    });

    if (existingUser) {
      throw createError({
        statusCode: 409, // 409 Conflict
        statusMessage: 'El correo electrónico ya está registrado.',
      });
    }

    // 4. Encriptar la contraseña (¡MUY IMPORTANTE!)
    // Usamos el campo 'contrase_a' que definiste en tu schema.prisma
    const hashedPassword = await bcrypt.hash(contraseña, 10); // 10 rondas de salt

    // 5. Crear el usuario en la base de datos
    const newUser = await db.usuario.create({
      data: {
        nombre,
        apellido_paterno,
        correo,
        contrase_a: hashedPassword, // Guardamos la clave encriptada
        id_rol: 1, // Asumimos '1' = Cliente (según tu SQL)
        fecha_registro: new Date(),
      },
    });

    // 6. Quitar la contraseña del objeto antes de devolverlo
    const { contrase_a, ...userWithoutPassword } = newUser;

    return {
      statusCode: 201, // 201 Created
      message: 'Usuario creado exitosamente.',
      user: userWithoutPassword,
    };

  } catch (error: any) {
    console.error("Error en API register:", error);

    // Si el error ya tiene un statusCode (como el 409), úsalo
    if (error.statusCode) {
      throw error;
    }

    // Error genérico
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al registrar el usuario.',
    });
  }
});