import {
  ADMIN_ARTWORK_LIST_SELECT,
  ARTWORK_EDITOR_SELECT,
  ARTWORK_OPTIONS_SELECT,
  FEATURED_ARTWORK_QUERY,
  PUBLISHED_ARTWORK_QUERY,
} from "@/features/artwork/repositories/artwork.queries"
import type { ArtworkAdminListFilters } from "@/features/artwork/types"

async function findPublishedArtworks() {
  const { prisma } = await import("@/db/client")
  return prisma.artwork.findMany(PUBLISHED_ARTWORK_QUERY)
}

async function findFeaturedArtwork() {
  const { prisma } = await import("@/db/client")
  return prisma.artwork.findMany(FEATURED_ARTWORK_QUERY)
}

async function findArtworkById(id: string) {
  const { prisma } = await import("@/db/client")
  return prisma.artwork.findUnique({
    where: { id },
    select: {
      id: true,
      primaryImagePath: true,
      additionalImages: { select: { id: true } },
    },
  })
}

async function findAdminArtworks(filters: ArtworkAdminListFilters) {
  const { prisma } = await import("@/db/client")

  return prisma.artwork.findMany({
    where: {
      category: filters.category,
      published: filters.published,
      title: filters.search
        ? { contains: filters.search, mode: "insensitive" }
        : undefined,
    },
    orderBy: [{ displayOrder: "asc" }, { title: "asc" }],
    select: ADMIN_ARTWORK_LIST_SELECT,
  })
}

async function findArtworkForEditor(id: string) {
  const { prisma } = await import("@/db/client")
  return prisma.artwork.findUnique({
    where: { id },
    select: ARTWORK_EDITOR_SELECT,
  })
}

async function findArtworkForOptions(id: string) {
  const { prisma } = await import("@/db/client")
  return prisma.artwork.findUnique({
    where: { id },
    select: ARTWORK_OPTIONS_SELECT,
  })
}

async function findArtworkImagePath(id: string) {
  const { prisma } = await import("@/db/client")
  return prisma.artwork.findUnique({
    where: { id },
    select: {
      primaryImagePath: true,
      additionalImages: { select: { storagePath: true } },
    },
  })
}

async function findArtworkImageCount(artworkId: string) {
  const { prisma } = await import("@/db/client")
  return prisma.artworkImage.count({ where: { artworkId } })
}

async function findArtworkImage(artworkId: string, imageId: string) {
  const { prisma } = await import("@/db/client")
  return prisma.artworkImage.findFirst({
    where: { id: imageId, artworkId },
  })
}

export {
  findAdminArtworks,
  findArtworkById,
  findArtworkForEditor,
  findArtworkForOptions,
  findArtworkImage,
  findArtworkImageCount,
  findArtworkImagePath,
  findFeaturedArtwork,
  findPublishedArtworks,
}
