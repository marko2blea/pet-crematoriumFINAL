import { db } from '../utils/prisma';
export default defineEventHandler(async (event) => {
  try {
    const bloques = await db.about_block.findMany({
      orderBy: { orden: 'asc' },
    });
    
    // (MODIFICADO) Mapear a un objeto simple (serializar)
    return bloques.map(b => ({
      id_block: b.id_block,
      title: b.title,
      body: b.body,
      items: b.items,
      orden: b.orden,
      creado_en: b.creado_en,
      imagen_url: b.imagen_url // <-- AÑADIDO
    }));

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener el contenido de "Nosotros".',
    });
  }
});