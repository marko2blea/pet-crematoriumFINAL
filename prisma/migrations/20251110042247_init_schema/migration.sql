-- CreateTable
CREATE TABLE "cementerio" (
    "id_cementerio" SERIAL NOT NULL,
    "seccion" VARCHAR(100),
    "num_parcela" VARCHAR(50),
    "disponible" BOOLEAN,
    "region" VARCHAR(100),
    "comuna" VARCHAR(100),
    "direccion" VARCHAR(255),

    CONSTRAINT "cementerio_pkey" PRIMARY KEY ("id_cementerio")
);

-- CreateTable
CREATE TABLE "detalle_reserva" (
    "id_detalle_reserva" SERIAL NOT NULL,
    "nombre_servicio" VARCHAR(255),
    "precio_servicio" DECIMAL(10,2),
    "tipo_servicio" VARCHAR(100),
    "desc_servicio" VARCHAR(500),
    "cantidad" INTEGER,
    "precio_total" DECIMAL(10,2),
    "cod_producto" INTEGER,

    CONSTRAINT "detalle_reserva_pkey" PRIMARY KEY ("id_detalle_reserva")
);

-- CreateTable
CREATE TABLE "especie" (
    "id_especie" SERIAL NOT NULL,
    "tipo_mascota" VARCHAR(100),
    "nombre_especie" VARCHAR(100),
    "raza" VARCHAR(100),

    CONSTRAINT "especie_pkey" PRIMARY KEY ("id_especie")
);

-- CreateTable
CREATE TABLE "mascota" (
    "id_mascota" SERIAL NOT NULL,
    "nombre_mascota" VARCHAR(100),
    "peso" DECIMAL(5,2),
    "edad" INTEGER,
    "diagnostico_sanitario" VARCHAR(500),
    "notas_manipulacion" VARCHAR(500),
    "id_especie" INTEGER,

    CONSTRAINT "mascota_pkey" PRIMARY KEY ("id_mascota")
);

-- CreateTable
CREATE TABLE "metodo_pago" (
    "id_metodo" SERIAL NOT NULL,
    "nombre_metodo" VARCHAR(100),
    "n_recibo_efectivo" INTEGER,
    "url_comprobante_transferencia" VARCHAR(255),
    "rut_emisor" VARCHAR(20),
    "banco_emisor" VARCHAR(100),
    "tipo_cuenta" VARCHAR(50),
    "num_cuenta" VARCHAR(50),
    "num_transaccion_externa" VARCHAR(100),

    CONSTRAINT "metodo_pago_pkey" PRIMARY KEY ("id_metodo")
);

-- CreateTable
CREATE TABLE "pago" (
    "id_pago" SERIAL NOT NULL,
    "nombre_metodo" VARCHAR(100),
    "fecha_pago" DATE,
    "monto" DECIMAL(10,2),
    "estado" VARCHAR(50),
    "id_metodo" INTEGER,

    CONSTRAINT "pago_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "producto" (
    "cod_producto" SERIAL NOT NULL,
    "nombre_producto" VARCHAR(255),
    "stock_actual" INTEGER,
    "precio_unitario" DECIMAL(10,2),
    "disponible" BOOLEAN,
    "tipo_producto" VARCHAR(100),
    "id_proveedor" INTEGER,

    CONSTRAINT "producto_pkey" PRIMARY KEY ("cod_producto")
);

-- CreateTable
CREATE TABLE "proveedor" (
    "id_proveedor" SERIAL NOT NULL,
    "proveedor" VARCHAR(255),
    "contacto" INTEGER,
    "region" VARCHAR(100),
    "comuna" VARCHAR(100),
    "direccion" VARCHAR(255),
    "disponible" BOOLEAN,

    CONSTRAINT "proveedor_pkey" PRIMARY KEY ("id_proveedor")
);

-- CreateTable
CREATE TABLE "reserva" (
    "id_reserva" SERIAL NOT NULL,
    "cod_trazabilidad" CHAR(9),
    "fecha_reservada" DATE,
    "hora_reservada" TIME(6),
    "region" VARCHAR(100),
    "comuna" VARCHAR(100),
    "direccion" VARCHAR(255),
    "precio_total" DECIMAL(10,2),
    "estado" BOOLEAN,
    "id_usuario" INTEGER,
    "id_cementerio" INTEGER,
    "id_pago" INTEGER,
    "id_detalle_reserva" INTEGER,

    CONSTRAINT "reserva_pkey" PRIMARY KEY ("id_reserva")
);

-- CreateTable
CREATE TABLE "rol" (
    "id_rol" SERIAL NOT NULL,
    "nombre_rol" VARCHAR(100),
    "descripcion_rol" VARCHAR(255),

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" VARCHAR(100),
    "apellido_paterno" VARCHAR(100),
    "apellido_materno" VARCHAR(100),
    "fecha_nacimiento" DATE,
    "correo" VARCHAR(255),
    "contraseña" VARCHAR(255),
    "telefono" INTEGER,
    "fecha_registro" DATE,
    "region" VARCHAR(100),
    "comuna" VARCHAR(100),
    "direccion" VARCHAR(255),
    "id_rol" INTEGER,
    "id_mascota" INTEGER,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "usuario_permisos" (
    "id_rol" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "estado" VARCHAR(50),

    CONSTRAINT "usuario_permisos_pkey" PRIMARY KEY ("id_rol","id_usuario")
);

-- CreateTable
CREATE TABLE "memorial" (
    "id_memorial" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "raza" VARCHAR(100),
    "fecha" DATE NOT NULL,
    "dedicatoria" VARCHAR(255),
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memorial_pkey" PRIMARY KEY ("id_memorial")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");

-- AddForeignKey
ALTER TABLE "detalle_reserva" ADD CONSTRAINT "detalle_reserva_cod_producto_fkey" FOREIGN KEY ("cod_producto") REFERENCES "producto"("cod_producto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mascota" ADD CONSTRAINT "mascota_id_especie_fkey" FOREIGN KEY ("id_especie") REFERENCES "especie"("id_especie") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_id_metodo_fkey" FOREIGN KEY ("id_metodo") REFERENCES "metodo_pago"("id_metodo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "producto" ADD CONSTRAINT "producto_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedor"("id_proveedor") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_cementerio_fkey" FOREIGN KEY ("id_cementerio") REFERENCES "cementerio"("id_cementerio") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_detalle_reserva_fkey" FOREIGN KEY ("id_detalle_reserva") REFERENCES "detalle_reserva"("id_detalle_reserva") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_pago_fkey" FOREIGN KEY ("id_pago") REFERENCES "pago"("id_pago") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_mascota_fkey" FOREIGN KEY ("id_mascota") REFERENCES "mascota"("id_mascota") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "rol"("id_rol") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_permisos" ADD CONSTRAINT "usuario_permisos_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "rol"("id_rol") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_permisos" ADD CONSTRAINT "usuario_permisos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;
