import { connection } from "next/server"

import type { Prisma } from "@/db/generated/prisma/client"
import {
  resolveArtworkImageSource,
  type ArtworkProjection,
} from "@/features/artwork/artwork-catalogue"

const PUBLISHED_ARTWORK_QUERY = {
  where: { published: true },
  orderBy: [
    { displayOrder: "asc" },
    { createdAt: "asc" },
    { id: "asc" },
  ],
  select: {
    slug: true,
    title: true,
    description: true,
    category: true,
    mediumFormat: true,
    displayedPieceDimensions: true,
    availability: true,
    primaryImagePath: true,
    primaryImageAlt: true,
    primaryImageWidth: true,
    primaryImageHeight: true,
    pricingMode: true,
    priceAmount: true,
  },
} satisfies Prisma.ArtworkFindManyArgs

type PublishedArtworkRecord = Prisma.ArtworkGetPayload<{
  select: typeof PUBLISHED_ARTWORK_QUERY.select
}>

function projectPublishedArtwork(
  artwork: PublishedArtworkRecord
): ArtworkProjection {
  return {
    slug: artwork.slug,
    title: artwork.title,
    description: artwork.description,
    category: artwork.category,
    mediumFormat: artwork.mediumFormat,
    displayedPieceDimensions: artwork.displayedPieceDimensions,
    availability: artwork.availability,
    imageSrc: resolveArtworkImageSource(artwork.primaryImagePath, {
      projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      bucket: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET,
    }),
    imageAlt:
      artwork.primaryImageAlt?.trim() ||
      `${artwork.title}, an artwork by Debby Art & Prints`,
    imageWidth: artwork.primaryImageWidth,
    imageHeight: artwork.primaryImageHeight,
    pricingMode: artwork.pricingMode,
    priceAmount: artwork.priceAmount?.toString() ?? null,
  }
}

async function getPublishedArtworks() {
  await connection()

  const { prisma } = await import("@/db/client")
  const artworks = await prisma.artwork.findMany(PUBLISHED_ARTWORK_QUERY)

  return artworks.map(projectPublishedArtwork)
}

export {
  PUBLISHED_ARTWORK_QUERY,
  getPublishedArtworks,
  projectPublishedArtwork,
  type PublishedArtworkRecord,
}
