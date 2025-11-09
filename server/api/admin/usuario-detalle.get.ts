// RUTA CORREGIDA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API para obtener el detalle de UN usuario por su ID
 * Y también la lista de TODOS los roles disponibles.
 * Ruta: /api/admin/usuario-detalle
 * Método: GET
 * Query Params: ?id= (El ID del usuario)
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const id = query.id as string | undefined;

    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de usuario inválido o no proporcionado.',
      });
    }

    // 1. Usar $transaction para hacer dos consultas a la vez
    const [usuario, roles] = await db.$transaction([
      // Consulta 1: Buscar el usuario específico
      db.usuario.findUniqueOrThrow({
        where: { id_usuario: Number(id) },
        select: {
          id_usuario: true,
          nombre: true,
          apellido_paterno: true,
          correo: true,
          id_rol: true, // El ID del rol actual
        },
      }),
      // Consulta 2: Buscar todos los roles disponibles
      db.rol.findMany({
        select: {
          id_rol: true,
          nombre_rol: true,
        },
      }),
    ]);

    // 2. Devolver ambos resultados
    return {
      usuario: usuario,
      rolesDisponibles: roles,
    };

  } catch (error: any) {
    console.error("Error al obtener detalle de usuario:", error);
    if (error.code === 'P2025') { // "Registro no encontrado"
       throw createError({ statusCode: 404, statusMessage: `Usuario con ID no encontrado.` });
    }
    throw createError({ statusCode: 500, statusMessage: 'Error al consultar el usuario.' });
  }
});