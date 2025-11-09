// RUTA CORREGIDA: Sube un nivel (desde /api/usuario/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API para que un usuario ACTUALICE (PUT) su propio perfil.
 * Ruta: /api/usuario/editar-perfil
 * Método: PUT
 */
export default defineEventHandler(async (event) => {
  try {
    // 1. Leer los datos que vienen del formulario 'editar-cuenta.vue'
    const body = await readBody(event);
    
    // Extraemos los datos del formulario
    const { 
      id_usuario, // ¡Importante! El cliente envía su propio ID
      nombre, 
      apellido_paterno,
      apellido_materno,
      telefono,
      region,
      comuna,
      direccion
    } = body;

    if (!id_usuario) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de usuario no proporcionado.',
      });
    }

    // 2. Actualizar la tabla 'usuario'
    const usuarioActualizado = await db.usuario.update({
      where: { id_usuario: Number(id_usuario) },
      data: {
        nombre: nombre,
        apellido_paterno: apellido_paterno,
        apellido_materno: apellido_materno,
        telefono: telefono ? Number(telefono) : null, // Convertir a número o nulo
        region: region,
        comuna: comuna,
        direccion: direccion,
      },
    });
    
    // 3. Quitar la contraseña del objeto antes de devolverlo
    const { contrase_a, ...userWithoutPassword } = usuarioActualizado;

    // 4. Éxito
    return {
      statusCode: 200,
      message: 'Perfil actualizado exitosamente.',
      user: userWithoutPassword, // Devolvemos el usuario actualizado
    };

  } catch (error: any) {
    console.error("Error al actualizar el perfil:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al actualizar el perfil.',
    });
  }
});