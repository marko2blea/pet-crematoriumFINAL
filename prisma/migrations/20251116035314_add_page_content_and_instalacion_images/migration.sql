-- CreateTable
CREATE TABLE "PageContent" (
    "page_key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,

    CONSTRAINT "PageContent_pkey" PRIMARY KEY ("page_key")
);

-- CreateIndex
CREATE UNIQUE INDEX "PageContent_page_key_key" ON "PageContent"("page_key");
