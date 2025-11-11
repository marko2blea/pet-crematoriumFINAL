-- CreateTable
CREATE TABLE "about_block" (
    "id_block" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT NOT NULL,
    "items" TEXT[],
    "orden" SERIAL NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "about_block_pkey" PRIMARY KEY ("id_block")
);
