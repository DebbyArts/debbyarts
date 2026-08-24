import "server-only"

import { connection } from "next/server"

import type { Prisma } from "@/db/generated/prisma/client"
import {
  getArtworkCategoryItemLabel,
  resolveArtworkImageSource,
} from "@/features/artwork/artwork-catalogue"
import type { RequestArtworkOption } from "@/features/enquiries/request-types"

const REQUEST_ARTWORK_SELECT = {
  id: true,
  slug: true,
  title: true,
  category: true,
  primaryImagePath: true,
  primaryImageAlt: true,
  availableSizes: true,
  framingEnabled: true,
  framingOptions: true,
  askQuantity: true,
} satisfies Prisma.ArtworkSelect

type RequestArtworkRecord = Prisma.ArtworkGetPayload<{
  select: typeof REQUEST_ARTWORK_SELECT
}>

function projectRequestArtwork(
  artwork: RequestArtworkRecord
): RequestArtworkOption {
  return {
    id: artwork.id,
    slug: artwork.slug,
    title: artwork.title,
    categoryLabel: getArtworkCategoryItemLabel(artwork.category),
    imageSrc: resolveArtworkImageSource(artwork.primaryImagePath, {
      projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      bucket: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET,
    }),
    imageAlt:
      artwork.primaryImageAlt?.trim() ||
      `${artwork.title}, an artwork by Debby Art & Prints`,
    availableSizes: artwork.availableSizes,
    framingEnabled: artwork.framingEnabled,
    framingOptions: artwork.framingOptions,
    askQuantity: artwork.askQuantity,
  }
}

async function getPublishedRequestArtworks() {
  await connection()

  const { prisma } = await import("@/db/client")
  const artworks = await prisma.artwork.findMany({
    where: { published: true },
    select: REQUEST_ARTWORK_SELECT,
    orderBy: [
      { displayOrder: "asc" },
      { createdAt: "asc" },
      { id: "asc" },
    ],
  })

  return artworks.map(projectRequestArtwork)
}

async function getPublishedRequestArtwork(slug: string) {
  const { prisma } = await import("@/db/client")
  const artwork = await prisma.artwork.findFirst({
    where: { slug, published: true },
    select: REQUEST_ARTWORK_SELECT,
  })

  return artwork ? projectRequestArtwork(artwork) : null
}

export {
  REQUEST_ARTWORK_SELECT,
  getPublishedRequestArtwork,
  getPublishedRequestArtworks,
  projectRequestArtwork,
  type RequestArtworkRecord,
}
