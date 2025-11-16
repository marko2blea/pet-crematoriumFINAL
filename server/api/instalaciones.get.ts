import { db } from '../utils/prisma';
export default defineEventHandler(async (event) => {
  try {
    const secciones = await db.instalacion.findMany({
      orderBy: { orden: 'asc' },
    });
    return secciones.map(s => ({
      id_instalacion: s.id_instalacion,
      title: s.title,
      body: s.body,
      features: s.features,
      imagen_url: s.imagen_url // <-- Asegúrate de que esto esté
    }));
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'Error al obtener las secciones.' });
  }
});