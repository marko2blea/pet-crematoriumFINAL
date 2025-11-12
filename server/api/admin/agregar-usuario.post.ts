// RUTA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';
import bcrypt from 'bcryptjs';

/**
 * API de ADMIN para CREAR (POST) un nuevo usuario.
 * Ruta: /api/admin/agregar-usuario
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
      id_rol,
      telefono,
      region,
      comuna,
      direccion
    } = await readBody(event);

    if (!nombre || !apellido_paterno || !correo || !password || !id_rol) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nombre, Apellido Paterno, Correo, Contraseña y Rol son obligatorios.',
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
        id_rol: Number(id_rol),
        // (MODIFICADO) Guardar los nuevos campos
        telefono: telefono ? Number(telefono) : null,
        region,
        comuna,
        direccion,
        fecha_registro: new Date(),
      },
    });

    // 4. Éxito
    return { 
      statusCode: 201, 
      message: 'Usuario creado exitosamente.'
    };

  } catch (error: any) {
    if (error.statusCode === 409 || error.statusCode === 400) {
      throw error;
    }
    console.error("Error al crear usuario (admin):", error);
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Error interno del servidor al crear el usuario.' 
    });
  }
});