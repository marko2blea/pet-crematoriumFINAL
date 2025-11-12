// RUTA: Sube dos niveles (desde /api/auth/ a /server/)
import { db } from '../../utils/prisma';
import bcrypt from 'bcryptjs';

/**
 * API para registrar (POST) un nuevo usuario (Cliente).
 * Ruta: /api/auth/registro
 * Método: POST
 */
export default defineEventHandler(async (event) => {
  try {
    // (MODIFICADO) Leer todos los campos del body
    const { 
      nombre, 
      apellido_paterno, 
      apellido_materno, 
      correo, 
      password,
      telefono,
      region,
      comuna,
      direccion
    } = await readBody(event);

    if (!nombre || !apellido_paterno || !correo || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nombre, Apellido Paterno, Correo y Contraseña son obligatorios.',
      });
    }

    // 1. Revisar si el correo ya existe
    const existingUser = await db.usuario.findUnique({
      where: { correo },
    });

    if (existingUser) {
      throw createError({
        statusCode: 409, // 409 Conflict
        statusMessage: 'El correo electrónico ya está registrado.',
      });
    }

    // 2. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Crear el nuevo usuario
    const newUser = await db.usuario.create({
      data: {
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        contrase_a: hashedPassword,
        // (MODIFICADO) Guardar los nuevos campos
        telefono: telefono ? Number(telefono) : null,
        region,
        comuna,
        direccion,
        id_rol: 1, // 1 = Cliente por defecto
        fecha_registro: new Date(),
      },
    });

    // 4. Éxito
    return { 
      statusCode: 201, 
      message: 'Usuario registrado exitosamente.'
    };

  } catch (error: any) {
    if (error.statusCode === 409 || error.statusCode === 400) {
      throw error;
    }
    console.error("Error al registrar usuario:", error);
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Error interno del servidor al registrar el usuario.' 
    });
  }
});