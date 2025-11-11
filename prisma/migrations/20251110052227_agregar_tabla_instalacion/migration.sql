-- CreateTable
CREATE TABLE "instalacion" (
    "id_instalacion" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT NOT NULL,
    "features" TEXT[],
    "orden" SERIAL NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "instalacion_pkey" PRIMARY KEY ("id_instalacion")
);
