/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `instalacion` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "producto" ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "imagen_url" VARCHAR(500);

-- CreateTable
CREATE TABLE "valoracion" (
    "id_valoracion" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "comentario" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_producto" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "valoracion_pkey" PRIMARY KEY ("id_valoracion")
);

-- CreateIndex
CREATE UNIQUE INDEX "valoracion_id_producto_id_usuario_key" ON "valoracion"("id_producto", "id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "instalacion_title_key" ON "instalacion"("title");

-- AddForeignKey
ALTER TABLE "valoracion" ADD CONSTRAINT "valoracion_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "producto"("cod_producto") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valoracion" ADD CONSTRAINT "valoracion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
