// RUTA CORREGIDA: Usamos la ruta relativa para subir un nivel (de /api a /)
// y luego entrar a /utils/prisma.
import { db } from '../utils/prisma';

/**
 * Este es un manejador de eventos de Nuxt 3.
 * Creará automáticamente una ruta GET en /api/roles
 */
export default defineEventHandler(async (event) => {
  try {
    // 1. Usa el cliente 'db' que creamos en prisma.ts
    // 2. Llama al modelo 'rol' (tal como se llama en tu schema.prisma)
    // 3. Usa la función 'findMany()' para obtener todos los registros
    const roles = await db.rol.findMany();

    // 4. Retorna los roles como JSON
    return roles;
  } catch (error) {
    console.error("Error al obtener roles:", error);
    // Manejo de errores
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al consultar la base de datos.',
    });
  }
});