import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Inicializa el cliente de Prisma
const db = new PrismaClient();

// Función para redondear a 0 decimales (para CLP)
function roundCLP(value: number): number {
  return Math.round(value);
}

async function main() {
  console.log('Iniciando el script de seed...');

  // ================================================================
  // 1. Crear Roles
  // ================================================================
  const rolCliente = await db.rol.upsert({
    where: { id_rol: 1 },
    update: {},
    create: { id_rol: 1, nombre_rol: 'Cliente', descripcion_rol: 'Usuario estándar' },
  });

  const rolAdmin = await db.rol.upsert({
    where: { id_rol: 2 },
    update: {},
    create: { id_rol: 2, nombre_rol: 'Admin', descripcion_rol: 'Administrador' },
  });
  console.log(`Roles '${rolCliente.nombre_rol}' y '${rolAdmin.nombre_rol}' asegurados.`);

  // ================================================================
  // 2. Crear Usuario Administrador
  // ================================================================
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'admin1234'; 
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await db.usuario.upsert({
    where: { correo: adminEmail }, // 'correo' es @unique y funciona bien
    update: { id_rol: rolAdmin.id_rol },
    create: {
      nombre: 'Admin',
      apellido_paterno: 'Principal',
      correo: adminEmail,
      contrase_a: hashedPassword, 
      id_rol: rolAdmin.id_rol, 
      fecha_registro: new Date(),
    },
  });
  console.log(`Usuario administrador '${adminUser.correo}' creado/actualizado.`);

  // ================================================================
  // 3. Crear Especies
  // ================================================================
  const especiePerro = await db.especie.upsert({
    where: { id_especie: 1 },
    update: {},
    create: { id_especie: 1, tipo_mascota: 'Canino', nombre_especie: 'Perro', raza: 'Mestizo' },
  });
  const especieGato = await db.especie.upsert({
    where: { id_especie: 2 },
    update: {},
    create: { id_especie: 2, tipo_mascota: 'Felino', nombre_especie: 'Gato', raza: 'Mestizo' },
  });
  console.log(`Especies '${especiePerro.nombre_especie}' y '${especieGato.nombre_especie}' creadas.`);

  // ================================================================
  // 4. Crear Métodos de Pago
  // ================================================================
  const metodoTransf = await db.metodo_pago.upsert({
    where: { id_metodo: 1 },
    update: {},
    create: { id_metodo: 1, nombre_metodo: 'Transferencia Bancaria' },
  });
  const metodoWebpay = await db.metodo_pago.upsert({
    where: { id_metodo: 2 },
    update: {},
    create: { id_metodo: 2, nombre_metodo: 'Webpay (Crédito)' },
  });
  console.log(`Métodos de pago '${metodoTransf.nombre_metodo}' y '${metodoWebpay.nombre_metodo}' creados.`);

  // ================================================================
  // 5. Crear Proveedores de ejemplo
  // ================================================================
  const prov2 = await db.proveedor.upsert({
    where: { id_proveedor: 2 },
    update: {},
    create: { id_proveedor: 2, proveedor: 'Urnas del Sur', contacto: 933334444, disponible: true },
  });
  console.log(`Proveedor '${prov2.proveedor}' creado.`);

  // ================================================================
  // 6. (MODIFICADO) Productos y Servicios base
  // ================================================================
  
  // -- SERVICIO 1 (Para la reserva de ejemplo) --
  const servicioTradicional = await db.producto.upsert({
    where: { cod_producto: 1 }, 
    update: {
      nombre_producto: 'Cremación Tradicional',
      precio_unitario: 150000,
      tipo_producto: 'Servicio',
      descripcion: 'Nuestro servicio de cremación individual tradicional asegura un proceso respetuoso y digno, garantizando que las cenizas devueltas son únicamente de su mascota.',
      imagen_url: 'servicio-tradicional.jpg'
    },
    create: { 
      cod_producto: 1, 
      nombre_producto: 'Cremación Tradicional',
      precio_unitario: 150000,
      stock_actual: 9999,
      disponible: true,
      tipo_producto: 'Servicio',
      descripcion: 'Nuestro servicio de cremación individual tradicional asegura un proceso respetuoso y digno, garantizando que las cenizas devueltas son únicamente de su mascota.',
      imagen_url: 'servicio-tradicional.jpg'
    },
  });

  // -- URNA (Ejemplo) --
  await db.producto.upsert({
    where: { cod_producto: 2 }, 
    update: {
      nombre_producto: 'Urna de Mármol Clásica',
      precio_unitario: 45000,
      tipo_producto: 'Urna',
      id_proveedor: prov2.id_proveedor,
      descripcion: 'Una urna elegante y atemporal, fabricada en mármol genuino para honrar la memoria de su compañero. Su peso y solidez proporcionan un lugar seguro y perpetuo para el descanso.',
      imagen_url: 'urna-marmol.jpg'
    },
    create: {
      cod_producto: 2, 
      nombre_producto: 'Urna de Mármol Clásica',
      precio_unitario: 45000,
      stock_actual: 15,
      disponible: true,
      tipo_producto: 'Urna', 
      id_proveedor: prov2.id_proveedor,
      descripcion: 'Una urna elegante y atemporal, fabricada en mármol genuino para honrar la memoria de su compañero. Su peso y solidez proporcionan un lugar seguro y perpetuo para el descanso.',
      imagen_url: 'urna-marmol.jpg'
    },
  });

  // -- ACCESORIO (Ejemplo) --
  await db.producto.upsert({
    where: { cod_producto: 3 }, 
    update: {
      nombre_producto: 'Placa Recordatoria Grabada',
      precio_unitario: 15000,
      tipo_producto: 'Accesorio', 
      id_proveedor: prov2.id_proveedor,
      descripcion: 'Una placa de bronce pulido con grabado láser del nombre y fechas de su mascota. Se adhiere a la urna.',
      imagen_url: 'placa-grabada.jpg'
    },
    create: {
      cod_producto: 3, 
      nombre_producto: 'Placa Recordatoria Grabada',
      precio_unitario: 15000,
      stock_actual: 50,
      disponible: true,
      tipo_producto: 'Accesorio', 
      id_proveedor: prov2.id_proveedor,
      descripcion: 'Una placa de bronce pulido con grabado láser del nombre y fechas de su mascota. Se adhiere a la urna.',
      imagen_url: 'placa-grabada.jpg'
    },
  });

  // -- SERVICIO 2 --
  await db.producto.upsert({
    where: { cod_producto: 4 }, 
    update: {
      nombre_producto: 'Cremación Presencial',
      precio_unitario: 200000,
      tipo_producto: 'Servicio',
      descripcion: 'Permite a la familia estar presente en una sala privada durante el inicio del proceso de cremación, ofreciendo una despedida final y personal.',
      imagen_url: 'servicio-presencial.jpg'
    },
    create: { 
      cod_producto: 4, 
      nombre_producto: 'Cremación Presencial',
      precio_unitario: 200000,
      stock_actual: 9999,
      disponible: true,
      tipo_producto: 'Servicio',
      descripcion: 'Permite a la familia estar presente en una sala privada durante el inicio del proceso de cremación, ofreciendo una despedida final y personal.',
      imagen_url: 'servicio-presencial.jpg'
    },
  });

  // -- SERVICIO 3 --
  await db.producto.upsert({
    where: { cod_producto: 5 }, 
    update: {
      nombre_producto: 'Servicio Eutanasia',
      precio_unitario: 50000,
      tipo_producto: 'Servicio',
      descripcion: 'Servicio de eutanasia a domicilio, realizado por un veterinario profesional, asegurando un adiós tranquilo y sin dolor en la comodidad de su hogar.',
      imagen_url: 'servicio-eutanasia.jpg'
    },
    create: { 
      cod_producto: 5, 
      nombre_producto: 'Servicio Eutanasia',
      precio_unitario: 50000,
      stock_actual: 9999,
      disponible: true,
      tipo_producto: 'Servicio',
      descripcion: 'Servicio de eutanasia a domicilio, realizado por un veterinario profesional, asegurando un adiós tranquilo y sin dolor en la comodidad de su hogar.',
      imagen_url: 'servicio-eutanasia.jpg'
    },
  });
  console.log('Productos (3 servicios, 1 urna, 1 accesorio) de ejemplo creados.');


  // ================================================================
  // 7. Crear una Reserva de Ejemplo Completa
  // ================================================================
  console.log('Creando reserva de ejemplo...');
  try {
    // 7.1. Crear un cliente de ejemplo
    const clienteEmail = 'juan.cliente@email.com';
    const clientePass = await bcrypt.hash('cliente123', 10);
    const clienteUser = await db.usuario.upsert({
        where: { correo: clienteEmail },
        update: {},
        create: {
            nombre: 'Juan',
            apellido_paterno: 'Cliente',
            correo: clienteEmail,
            contrase_a: clientePass,
            id_rol: rolCliente.id_rol,
            fecha_registro: new Date(),
            region: 'Biobío',
            comuna: 'Concepción',
            direccion: 'Calle Falsa 123'
        }
    });

    // 7.2. (CORREGIDO) Crear mascota con UPSERT
    const mascotaFido = await db.mascota.upsert({
        where: { id_mascota: 1 }, // Usamos ID 1
        update: {},
        create: {
            id_mascota: 1,
            nombre_mascota: 'Fido',
            peso: 12.5,
            edad: 8,
            id_especie: especiePerro.id_especie,
        }
    });
    
    // 7.3. (CORREGIDO) Vincular mascota al cliente (solo si no la tiene ya)
    if (!clienteUser.id_mascota) {
        await db.usuario.update({
            where: { id_usuario: clienteUser.id_usuario },
            data: { id_mascota: mascotaFido.id_mascota }
        });
    }
    console.log(`Cliente '${clienteUser.correo}' y mascota '${mascotaFido.nombre_mascota}' creados/asegurados.`);

    // 7.4. (CORREGIDO) Crear la transacción solo si no existe
    // Usamos el ID de la reserva para el 'upsert'
    const precioBase = Number(servicioTradicional.precio_unitario);
    const precioTotalConIVA = roundCLP(precioBase * 1.19);

    const reservaEjemplo = await db.reserva.findUnique({
        where: { id_reserva: 1 }
    });

    if (!reservaEjemplo) {
        await db.$transaction(async (tx) => {
            const detalle = await tx.detalle_reserva.create({
                data: {
                    id_detalle_reserva: 1, // Asignamos ID
                    nombre_servicio: servicioTradicional.nombre_producto,
                    precio_servicio: precioBase,
                    tipo_servicio: 'Servicio',
                    cantidad: 1,
                    precio_total: precioTotalConIVA,
                    cod_producto: servicioTradicional.cod_producto
                }
            });
            const pago = await tx.pago.create({
                data: {
                    id_pago: 1, // Asignamos ID
                    nombre_metodo: metodoTransf.nombre_metodo,
                    fecha_pago: new Date(),
                    monto: precioTotalConIVA,
                    estado: 'Pagado',
                    id_metodo: metodoTransf.id_metodo
                }
            });
            await tx.reserva.create({
                data: {
                    id_reserva: 1, // Asignamos ID
                    cod_trazabilidad: 'ABC-12345',
                    fecha_reservada: new Date(),
                    hora_reservada: new Date(),
                    region: clienteUser.region,
                    comuna: clienteUser.comuna,
                    direccion: clienteUser.direccion,
                    precio_total: precioTotalConIVA,
                    estado: true,
                    id_usuario: clienteUser.id_usuario,
                    id_pago: pago.id_pago,
                    id_detalle_reserva: detalle.id_detalle_reserva,
                }
            });
        });
        console.log('Reserva de ejemplo (Pagada y Finalizada) creada con éxito.');
    } else {
        console.log('La reserva de ejemplo ya existe.');
    }

  } catch (e: any) {
    console.error('Error al crear la reserva de ejemplo:', e.message);
  }

  // ================================================================
  // 8. Crear Secciones de Instalaciones de ejemplo
  // ================================================================
  console.log('Creando secciones de instalaciones de ejemplo...');
  await db.instalacion.upsert({
    where: { id_instalacion: 1 },
    update: { title: "Recepción y Sala de Estar", body: "Un espacio acogedor y tranquilo...", features: ["Ambiente climatizado", "Asientos cómodos", "Dispensador de agua y café", "Atención personalizada"]}, 
    create: { id_instalacion: 1, title: "Recepción y Sala de Estar", body: "Un espacio acogedor y tranquilo donde las familias pueden esperar en privacidad. Ofrecemos un ambiente sereno para procesar su duelo y realizar los trámites necesarios con la dignidad que merecen.", features: ["Ambiente climatizado", "Asientos cómodos", "Dispensador de agua y café", "Atención personalizada"], orden: 1 },
  });
  await db.instalacion.upsert({
    where: { id_instalacion: 2 },
    update: { title: "Sala de Despedida Privada", body: "Nuestra sala de despedida permite...", features: ["Totalmente privada y aislada", "Ambiente tranquilo y respetuoso", "Opción de visualizar el inicio del servicio (si se solicita)"]},
    create: { id_instalacion: 2, title: "Sala de Despedida Privada", body: "Nuestra sala de despedida permite a las familias un último adiós íntimo. Es un espacio diseñado para el respeto y el recogimiento, donde pueden pasar un momento a solas con su compañero antes del servicio.", features: ["Totalmente privada y aislada", "Ambiente tranquilo y respetuoso", "Opción de visualizar el inicio del servicio (si se solicita)"], orden: 2 },
  });
  await db.instalacion.upsert({
    where: { id_instalacion: 3 },
    update: { title: "Horno Crematorio de Última Generación", body: "Contamos con tecnología de punta...", features: ["Horno importado de alta eficiencia", "Proceso 100% individual (sin cruces)", "Cumple con todas las normativas medioambientales"]},
    create: { id_instalacion: 3, title: "Horno Crematorio de Última Generación", body: "Contamos con tecnología de punta que asegura un proceso individual, ético y ecológicamente responsable. El sistema garantiza la total integridad del servicio y la recuperación completa de las cenizas.", features: ["Horno importado de alta eficiencia", "Proceso 100% individual (sin cruces)", "Cumple con todas las normativas medioambientales"], orden: 3 },
  });
  console.log('Secciones de instalaciones creadas.');

  // ================================================================
  // 9. Crear Bloques de "Nosotros" (Misión, Visión, Valores)
  // ================================================================
  console.log('Creando bloques de "Nosotros" de ejemplo...');
  await db.about_block.upsert({
    where: { id_block: 1 },
    update: {
      title: "Nuestra Misión",
      body: "Nuestra misión es proporcionar un servicio de cremación digno y respetuoso para las mascotas, ofreciendo a las familias un apoyo compasivo y profesional en su momento de duelo. Nos comprometemos a honrar la vida de cada compañero con la máxima integridad.",
      items: [], 
    },
    create: {
      id_block: 1,
      title: "Nuestra Misión",
      body: "Nuestra misión es proporcionar un servicio de cremación digno y respetuoso para las mascotas, ofreciendo a las familias un apoyo compasivo y profesional en su momento de duelo. Nos comprometemos a honrar la vida de cada compañero con la máxima integridad.",
      items: [],
      orden: 1,
    }
  });
  await db.about_block.upsert({
    where: { id_block: 2 },
    update: {
      title: "Nuestra Visión",
      body: "Ser la principal referencia en servicios funerarios para mascotas en la región, reconocidos por nuestra excelencia operativa, nuestra calidad humana y nuestro profundo respeto por el vínculo entre las personas y sus animales de compañía.",
      items: [],
    },
    create: {
      id_block: 2,
      title: "Nuestra Visión",
      body: "Ser la principal referencia en servicios funerarios para mascotas en la región, reconocidos por nuestra excelencia operativa, nuestra calidad humana y nuestro profundo respeto por el vínculo entre las personas y sus animales de compañía.",
      items: [],
      orden: 2,
    }
  });
  await db.about_block.upsert({
    where: { id_block: 3 },
    update: {
      title: "Nuestros Valores",
      body: "Nuestra labor se fundamenta en principios sólidos que guían cada una de nuestras acciones:",
      items: [
        "Compromiso: Con la calidad del servicio y el bienestar de las familias.",
        "Respeto: Por la vida de la mascota y el dolor de sus dueños.",
        "Integridad: Actuando con honestidad y transparencia en todo momento.",
        "Empatía: Comprendiendo y acompañando a cada familia desde el corazón."
      ],
    },
    create: {
      id_block: 3,
      title: "Nuestros Valores",
      body: "Nuestra labor se fundamenta en principios sólidos que guían cada una de nuestras acciones:",
      items: [
        "Compromiso: Con la calidad del servicio y el bienestar de las familias.",
        "Respeto: Por la vida de la mascota y el dolor de sus dueños.",
        "Integridad: Actuando con honestidad y transparencia en todo momento.",
        "Empatía: Comprendiendo y acompañando a cada familia desde el corazón."
      ],
      orden: 3,
    }
  });
  console.log('Bloques de "Nosotros" creados.');

}

// Ejecutar la función main y manejar la desconexión
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
    console.log('Seed completado. Desconectado de la base de datos.');
  });