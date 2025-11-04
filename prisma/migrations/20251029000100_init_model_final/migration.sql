-- CreateTable
CREATE TABLE "Rol" (
    "id_rol" SERIAL NOT NULL,
    "nombre_rol" TEXT NOT NULL,
    "permiso_rol" TEXT,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" TEXT,
    "apellido_paterno" TEXT,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "id_rol" INTEGER NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id_proveedor" SERIAL NOT NULL,
    "proveedor" TEXT,
    "contacto" INTEGER,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id_proveedor")
);

-- CreateTable
CREATE TABLE "Producto" (
    "cod_producto" SERIAL NOT NULL,
    "nombre_producto" TEXT,
    "stock_actual" INTEGER,
    "precio_unitario" DOUBLE PRECISION,
    "disponible" BOOLEAN,
    "tipo_producto" TEXT,
    "id_proveedor" INTEGER,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("cod_producto")
);

-- CreateTable
CREATE TABLE "Mascota" (
    "id_mascota" SERIAL NOT NULL,
    "nombre_mascota" TEXT,
    "peso" DOUBLE PRECISION,

    CONSTRAINT "Mascota_pkey" PRIMARY KEY ("id_mascota")
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id_reserva" SERIAL NOT NULL,
    "cod_trazabilidad" TEXT NOT NULL,
    "fecha_reservada" TIMESTAMP(3),
    "estado" TEXT,
    "precio_total" DOUBLE PRECISION,
    "id_usuario" INTEGER,
    "id_mascota" INTEGER,
    "id_pago" INTEGER,
    "id_detalle_reserva" INTEGER NOT NULL,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id_reserva")
);

-- CreateTable
CREATE TABLE "DetalleReserva" (
    "id_detalle_reserva" SERIAL NOT NULL,
    "nombre_servicio" TEXT,
    "precio_servicio" TEXT,
    "cantidad" INTEGER,
    "cod_producto" INTEGER,

    CONSTRAINT "DetalleReserva_pkey" PRIMARY KEY ("id_detalle_reserva")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id_pago" SERIAL NOT NULL,
    "nombre_metodo" TEXT,
    "fecha_pago" TIMESTAMP(3),
    "monto" DOUBLE PRECISION,
    "estado" TEXT,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id_pago")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_rol_key" ON "Rol"("nombre_rol");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_cod_trazabilidad_key" ON "Reserva"("cod_trazabilidad");

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_id_pago_key" ON "Reserva"("id_pago");

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_id_detalle_reserva_key" ON "Reserva"("id_detalle_reserva");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "Rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "Proveedor"("id_proveedor") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_id_mascota_fkey" FOREIGN KEY ("id_mascota") REFERENCES "Mascota"("id_mascota") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_id_pago_fkey" FOREIGN KEY ("id_pago") REFERENCES "Pago"("id_pago") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_id_detalle_reserva_fkey" FOREIGN KEY ("id_detalle_reserva") REFERENCES "DetalleReserva"("id_detalle_reserva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleReserva" ADD CONSTRAINT "DetalleReserva_cod_producto_fkey" FOREIGN KEY ("cod_producto") REFERENCES "Producto"("cod_producto") ON DELETE SET NULL ON UPDATE CASCADE;
