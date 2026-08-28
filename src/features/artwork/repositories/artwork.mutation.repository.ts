import type { Prisma } from "@/db/generated/prisma/client"

async function createArtwork(data: Prisma.ArtworkCreateInput) {
  const { prisma } = await import("@/db/client")
  return prisma.artwork.create({ data })
}

async function updateArtwork(id: string, data: Prisma.ArtworkUpdateInput) {
  const { prisma } = await import("@/db/client")
  return prisma.artwork.update({ where: { id }, data })
}

async function createArtworkImage(data: Prisma.ArtworkImageCreateInput) {
  const { prisma } = await import("@/db/client")
  return prisma.artworkImage.create({ data })
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
  createArtwork,
  createArtworkImage,
  deleteArtwork,
  deleteArtworkImage,
  moveArtworkImage,
  updateArtwork,
  updateArtworkImageAlt,
}
