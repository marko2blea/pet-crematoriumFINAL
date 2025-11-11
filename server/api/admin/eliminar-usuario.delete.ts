// RUTA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';
import type { User } from '../../../app/types'; // Importa tu tipo User

/**
 * API para ELIMINAR (DELETE) un usuario.
 * Ruta: /api/admin/eliminar-usuario
 * Método: DELETE
 */
export default defineEventHandler(async (event) => {
  try {
    // 1. Obtener el ID del admin que está haciendo la solicitud
    const adminUser = event.context.user as User;
    if (!adminUser) {
      throw createError({ statusCode: 401, statusMessage: 'No autorizado' });
    }

    // 2. Obtener el ID del usuario a eliminar (del body)
    const { id: userIdToDelete }: { id: number } = await readBody(event);

    if (!userIdToDelete || isNaN(Number(userIdToDelete))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de usuario no válido o no proporcionado.',
      });
    }

    // 3. MEDIDA DE SEGURIDAD: Evitar que un admin se elimine a sí mismo
    if (adminUser.id_usuario === userIdToDelete) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No puede eliminar su propia cuenta de administrador.',
      });
    }

    // 4. Usar una transacción para eliminar dependencias primero
    await db.$transaction([
      // A. Eliminar sus permisos (de la tabla M-M 'usuario_permisos')
      db.usuario_permisos.deleteMany({
        where: { id_usuario: userIdToDelete },
      }),
      
      // B. Intentar eliminar al usuario
      db.usuario.delete({
        where: { id_usuario: userIdToDelete },
      }),
    ]);

    // 5. Éxito
    return { 
      statusCode: 200, 
      message: 'Usuario eliminado exitosamente.' 
    };

  } catch (error: any) {
    console.error("Error al eliminar usuario:", error);
    
    // 6. (IMPORTANTE) Capturar error de llave foránea (P2003)
    // Esto pasa si el usuario tiene 'reservas' o 'mascotas' asociadas
    if (error.code === 'P2003') {
      throw createError({
        statusCode: 409, // 409 Conflict
        statusMessage: 'Error: Este usuario no se puede eliminar porque tiene reservas o mascotas asociadas.'
      });
    }

    // 7. Capturar si el usuario no existe (P2025)
    if (error.code === 'P2025') {
      throw createError({ 
        statusCode: 404, 
        statusMessage: 'Usuario no encontrado.' 
      });
    }

    // 8. Otro error
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Error interno del servidor al eliminar el usuario.' 
    });
  }
});