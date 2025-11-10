import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Inicializa el cliente de Prisma
const db = new PrismaClient();

async function main() {
  console.log('Iniciando el script de seed...');

  // ================================================================
  // 1. Crear Roles
  // (Usa UPSERT para crear si no existen, o no hacer nada si ya existen)
  // ================================================================
  const rolCliente = await db.rol.upsert({
    where: { id_rol: 1 },
    update: {}, // No actualiza nada si ya existe
    create: {
      id_rol: 1,
      nombre_rol: 'Cliente',
      descripcion_rol: 'Usuario estándar de la plataforma.'
    },
  });

  const rolAdmin = await db.rol.upsert({
    where: { id_rol: 2 },
    update: {}, // No actualiza nada si ya existe
    create: {
      id_rol: 2,
      nombre_rol: 'Admin',
      descripcion_rol: 'Administrador con todos los permisos.'
    },
  });
  console.log(`Roles '${rolCliente.nombre_rol}' y '${rolAdmin.nombre_rol}' asegurados.`);

  // ================================================================
  // 2. Crear Usuario Administrador
  // (Usa UPSERT para crear el admin si no existe, o actualizarlo si ya existe)
  // ================================================================
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'admin1234'; // Puedes cambiar esta contraseña
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await db.usuario.upsert({
    where: { correo: adminEmail }, // Busca por el email único
    update: { 
      id_rol: rolAdmin.id_rol // Si ya existe, solo asegura que sea admin
    },
    create: {
      nombre: 'Admin',
      apellido_paterno: 'Principal',
      correo: adminEmail,
      contrase_a: hashedPassword, // El campo 'contraseña' en tu schema
      id_rol: rolAdmin.id_rol, // Asigna el ID del rol Admin (2)
      fecha_registro: new Date(),
    },
  });
  console.log(`Usuario administrador '${adminUser.correo}' creado/actualizado con éxito.`);

  // ================================================================
  // 3. Crear Especies
  // ================================================================
  const especiePerro = await db.especie.upsert({
    where: { id_especie: 1 }, // ID 1
    update: {},
    create: {
      id_especie: 1,
      tipo_mascota: 'Canino',
      nombre_especie: 'Perro',
      raza: 'Mestizo' 
    },
  });
  const especieGato = await db.especie.upsert({
    where: { id_especie: 2 }, // ID 2
    update: {},
    create: {
      id_especie: 2,
      tipo_mascota: 'Felino',
      nombre_especie: 'Gato',
      raza: 'Mestizo'
    },
  });
  console.log(`Especies '${especiePerro.nombre_especie}' y '${especieGato.nombre_especie}' creadas.`);

  // ================================================================
  // 4. Crear Métodos de Pago
  // ================================================================
  const metodoTransf = await db.metodo_pago.upsert({
    where: { id_metodo: 1 }, // ID 1
    update: {},
    create: {
      id_metodo: 1,
      nombre_metodo: 'Transferencia Bancaria'
    },
  });
  const metodoWebpay = await db.metodo_pago.upsert({
    where: { id_metodo: 2 }, // ID 2
    update: {},
    create: {
      id_metodo: 2,
      nombre_metodo: 'Webpay (Crédito)'
    },
  });
  console.log(`Métodos de pago '${metodoTransf.nombre_metodo}' y '${metodoWebpay.nombre_metodo}' creados.`);

  // ================================================================
  // 5. Crear Proveedores de ejemplo
  // ================================================================
  const prov1 = await db.proveedor.upsert({
    where: { id_proveedor: 1 },
    update: {},
    create: {
      id_proveedor: 1,
      proveedor: 'Insumos Patitas',
      contacto: 911112222,
      disponible: true,
    }
  });
  const prov2 = await db.proveedor.upsert({
    where: { id_proveedor: 2 },
    update: {},
    create: {
      id_proveedor: 2,
      proveedor: 'Urnas del Sur',
      contacto: 933334444,
      disponible: true,
    }
  });
  console.log(`Proveedores '${prov1.proveedor}' y '${prov2.proveedor}' creados.`);

  // ================================================================
  // 6. Crear Productos y Servicios de ejemplo
  // ================================================================
  await db.producto.upsert({
    where: { nombre_producto: 'Servicio Tradicional' },
    update: {},
    create: {
      nombre_producto: 'Servicio Tradicional',
      precio_unitario: 150000,
      stock_actual: 9999,
      disponible: true,
      tipo_producto: 'Servicio' 
    },
  });
  await db.producto.upsert({
    where: { nombre_producto: 'Urna de Mármol Clásica' },
    update: {},
    create: {
      nombre_producto: 'Urna de Mármol Clásica',
      precio_unitario: 45000,
      stock_actual: 15,
      disponible: true,
      tipo_producto: 'Urna', 
      id_proveedor: prov2.id_proveedor 
    },
  });
  console.log('Productos y servicios de ejemplo creados.');

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