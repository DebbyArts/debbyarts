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
  additionalImages: {
    orderBy: { displayOrder: "asc" },
    select: {
      id: true,
      storagePath: true,
      altText: true,
      width: true,
      height: true,
    },
  },
} satisfies Prisma.ArtworkSelect

const ARTWORK_OPTIONS_SELECT = {
  id: true,
  title: true,
  availableSizes: true,
  framingEnabled: true,
  framingOptions: true,
  askQuantity: true,
} satisfies Prisma.ArtworkSelect

const PUBLISHED_ARTWORK_QUERY = {
  where: { published: true },
  orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }, { id: "asc" }],
  select: {
    slug: true, title: true, description: true, category: true,
    mediumFormat: true, displayedPieceDimensions: true, availability: true,
    primaryImagePath: true, primaryImageAlt: true, primaryImageWidth: true,
    primaryImageHeight: true, pricingMode: true, priceAmount: true,
    additionalImages: {
      orderBy: { displayOrder: "asc" },
      select: { id: true, storagePath: true, altText: true, width: true, height: true },
    },
  },
} satisfies Prisma.ArtworkFindManyArgs

async function findPublishedArtworks() {
  const { prisma } = await import("@/db/client")
  return prisma.artwork.findMany(PUBLISHED_ARTWORK_QUERY)
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

async function createArtworkImage(data: Prisma.ArtworkImageCreateInput) {
  const { prisma } = await import("@/db/client")
  return prisma.artworkImage.create({ data })
}

async function findArtworkImage(artworkId: string, imageId: string) {
  const { prisma } = await import("@/db/client")
  return prisma.artworkImage.findFirst({
    where: { id: imageId, artworkId },
  })
}

async function updateArtworkImageAlt(
  artworkId: string,
  imageId: string,
  altText: string | null
) {
  const { prisma } = await import("@/db/client")
  return prisma.artworkImage.updateMany({
    where: { id: imageId, artworkId },
    data: { altText },
  })
}

async function deleteArtworkImage(artworkId: string, imageId: string) {
  const { prisma } = await import("@/db/client")
  return prisma.$transaction(async (transaction) => {
    const deleted = await transaction.artworkImage.deleteMany({
      where: { id: imageId, artworkId },
    })
    if (!deleted.count) return deleted

    const remainingImages = await transaction.artworkImage.findMany({
      where: { artworkId },
      orderBy: { displayOrder: "asc" },
    })
    const temporaryOffset =
      Math.max(...remainingImages.map((image) => image.displayOrder), 0) +
      remainingImages.length +
      1

    await Promise.all(
      remainingImages.map((image, index) =>
        transaction.artworkImage.update({
          where: { id: image.id },
          data: { displayOrder: index + temporaryOffset },
        })
      )
    )
    await Promise.all(
      remainingImages.map((image, index) =>
        transaction.artworkImage.update({
          where: { id: image.id },
          data: { displayOrder: index },
        })
      )
    )

    return deleted
  })
}

async function moveArtworkImage(
  artworkId: string,
  imageId: string,
  direction: "up" | "down"
) {
  const { prisma } = await import("@/db/client")

  return prisma.$transaction(async (transaction) => {
    const images = await transaction.artworkImage.findMany({
      where: { artworkId },
      orderBy: { displayOrder: "asc" },
    })
    const index = images.findIndex((image) => image.id === imageId)
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (index < 0 || targetIndex < 0 || targetIndex >= images.length) return false

    const reordered = [...images]
    ;[reordered[index], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[index],
    ]
    const temporaryOffset =
      Math.max(...images.map((image) => image.displayOrder), 0) + images.length + 1
    await Promise.all(
      reordered.map((image, nextIndex) =>
        transaction.artworkImage.update({
          where: { id: image.id },
          data: { displayOrder: nextIndex + temporaryOffset },
        })
      )
    )
    await Promise.all(
      reordered.map((image, nextIndex) =>
        transaction.artworkImage.update({
          where: { id: image.id },
          data: { displayOrder: nextIndex },
        })
      )
    )

    return true
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
  PUBLISHED_ARTWORK_QUERY,
  createArtwork,
  createArtworkImage,
  deleteArtwork,
  deleteArtworkImage,
  findAdminArtworks,
  findArtworkById,
  findArtworkForEditor,
  findArtworkForOptions,
  findArtworkImagePath,
  findArtworkImage,
  findArtworkImageCount,
  findPublishedArtworks,
  updateArtwork,
  updateArtworkImageAlt,
  moveArtworkImage,
}
