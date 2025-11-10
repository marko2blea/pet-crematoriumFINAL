/*
  Warnings:

  - A unique constraint covering the columns `[nombre_producto]` on the table `producto` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "producto_nombre_producto_key" ON "producto"("nombre_producto");
