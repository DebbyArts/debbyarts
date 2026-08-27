import type { Prisma } from "@/db/generated/prisma/client"

async function findArtworkById(id: string) {
  const { prisma } = await import("@/db/client")
  return prisma.artwork.findUnique({ where: { id } })
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

export { createArtwork, deleteArtwork, findArtworkById, findArtworkImagePath, updateArtwork }
