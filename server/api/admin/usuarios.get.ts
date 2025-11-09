// RUTA CORREGIDA: Sube dos niveles (desde /api/admin/ a /server/)
import { db } from '../../utils/prisma';

/**
 * API para obtener la lista COMPLETA de usuarios (clientes y admins).
 * Ruta: /api/admin/usuarios
 * Método: GET
 */
export default defineEventHandler(async (event) => {
  try {
    // 1. Ejecutar la consulta
    const usuarios = await db.usuario.findMany({
      orderBy: {
        fecha_registro: 'desc', // Los más nuevos primero
      },
      include: {
        rol: { // Incluir el rol relacionado
          select: {
            nombre_rol: true, // Solo necesitamos el nombre del rol
          },
        },
      },
    });

    // 2. Formatear la respuesta para 'gestionar-usuario.vue'
    const formattedUsuarios = usuarios.map((u) => {
      // Ocultamos la contraseña por seguridad, aunque la API de admin la pida
      // (En este caso no la pedimos en la consulta, pero es buena práctica)
      return {
        id: u.id_usuario,
        nombre: `${u.nombre || 'Sin'} ${u.apellido_paterno || 'Nombre'}`.trim(),
        email: u.correo || 'N/A',
        rol: u.rol?.nombre_rol || 'N/A', // 'Cliente' o 'Admin'
        fechaRegistro: u.fecha_registro ? new Date(u.fecha_registro).toLocaleDateString('es-CL') : 'N/A',
      };
    });

    return formattedUsuarios;

  } catch (error: any) {
    console.error("Error al obtener lista de usuarios:", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al consultar los usuarios.',
    });
  }
});