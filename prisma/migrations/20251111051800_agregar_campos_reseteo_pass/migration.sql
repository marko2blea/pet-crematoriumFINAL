/*
  Warnings:

  - A unique constraint covering the columns `[reset_token]` on the table `usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "usuario" ADD COLUMN     "reset_token" VARCHAR(255),
ADD COLUMN     "reset_token_expires" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_reset_token_key" ON "usuario"("reset_token");
