-- CreateTable
CREATE TABLE "ArtworkImage" (
    "id" TEXT NOT NULL,
    "artworkId" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "altText" TEXT,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtworkImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArtworkImage_storagePath_key" ON "ArtworkImage"("storagePath");

-- CreateIndex
CREATE UNIQUE INDEX "ArtworkImage_artworkId_displayOrder_key" ON "ArtworkImage"("artworkId", "displayOrder");

-- AddForeignKey
ALTER TABLE "ArtworkImage" ADD CONSTRAINT "ArtworkImage_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Keep the feature-owned relation equally protected from the Supabase Data API.
ALTER TABLE "ArtworkImage" ENABLE ROW LEVEL SECURITY;
