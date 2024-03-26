-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grammy" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Artist_id_key" ON "Artist"("id");
