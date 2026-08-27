import type { Prisma } from "@/db/generated/prisma/client"
import type { ArtworkAdminListFilters } from "@/features/artwork/types"

const ADMIN_ARTWORK_LIST_SELECT = {
  id: true,
  title: true,
  category: true,
  availability: true,
  primaryImagePath: true,
  primaryImageAlt: true,
  published: true,
  featured: true,
  displayOrder: true,
} satisfies Prisma.ArtworkSelect

const ARTWORK_EDITOR_SELECT = {
  id: true,
  title: true,
  description: true,
  category: true,
  mediumFormat: true,
  displayedPieceDimensions: true,
  availability: true,
  primaryImagePath: true,
  primaryImageAlt: true,
  pricingMode: true,
  priceAmount: true,
  published: true,
  featured: true,
  displayOrder: true,
} satisfies Prisma.ArtworkSelect

const ARTWORK_OPTIONS_SELECT = {
  id: true,
  title: true,
  availableSizes: true,
  framingEnabled: true,
  framingOptions: true,
  askQuantity: true,
} satisfies Prisma.ArtworkSelect

async function findArtworkById(id: string) {
  const { prisma } = await import("@/db/client")
  return prisma.artwork.findUnique({ where: { id } })
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

async function createArtwork(data: Prisma.ArtworkCreateInput) {
  const { prisma } = await import("@/db/client")
  return prisma.artwork.create({ data })
}

async function updateArtwork(id: string, data: Prisma.ArtworkUpdateInput) {
  const { prisma } = await import("@/db/client")
  return prisma.artwork.update({ where: { id }, data })
}

async function findArtworkImagePath(id: string) {
  const { prisma } = await import("@/db/client")
  return prisma.artwork.findUnique({
    where: { id }, select: { primaryImagePath: true },
  })
}

async function deleteArtwork(id: string) {
  const { prisma } = await import("@/db/client")
  return prisma.artwork.delete({ where: { id } })
}

export {
  ADMIN_ARTWORK_LIST_SELECT,
  ARTWORK_EDITOR_SELECT,
  ARTWORK_OPTIONS_SELECT,
  createArtwork,
  deleteArtwork,
  findAdminArtworks,
  findArtworkById,
  findArtworkForEditor,
  findArtworkForOptions,
  findArtworkImagePath,
  updateArtwork,
}
