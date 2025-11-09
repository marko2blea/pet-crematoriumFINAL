// RUTA CORREGIDA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';
import bcrypt from 'bcryptjs';

/**
 * API para CREAR (POST) un nuevo usuario manualmente (Admin).
 * Ruta: /api/admin/agregar-usuario
 * Método: POST
 */
export default defineEventHandler(async (event) => {
  try {
    // 1. Leer los datos que vienen del formulario
    const body = await readBody(event);
    const { nombre, apellido_paterno, correo, contraseña, id_rol } = body;

    // 2. Validar datos
    if (!correo || !contraseña || !nombre || !id_rol) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Faltan campos obligatorios (nombre, correo, contraseña, rol).',
      });
    }

    // 3. Revisar si el usuario ya existe
    const existingUser = await db.usuario.findUnique({
      where: { correo: correo },
    });

    if (existingUser) {
      throw createError({
        statusCode: 409, // Conflicto
        statusMessage: 'El correo electrónico ya está registrado.',
      });
    }

    // 4. Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // 5. Crear el usuario en la base de datos
    const newUser = await db.usuario.create({
      data: {
        nombre,
        apellido_paterno,
        correo,
        contrase_a: hashedPassword,
        id_rol: Number(id_rol), // Asignar el ROL seleccionado
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
    console.error("Error al crear usuario (admin):", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al crear el usuario.',
    });
  }
});