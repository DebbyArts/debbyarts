import type { Prisma } from "@/db/generated/prisma/client"

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

const REQUEST_SERVICE_SELECT = {
  id: true,
  slug: true,
  name: true,
  group: true,
  primaryImagePath: true,
  primaryImageAlt: true,
  askQuantity: true,
  askSizeFormat: true,
  sizeFormatOptions: true,
  askDesignReadiness: true,
  askColour: true,
  askMaterial: true,
  materialOptions: true,
  askFinish: true,
} satisfies Prisma.ServiceSelect

async function findPublishedRequestArtworks() {
  const { prisma } = await import("@/db/client")

  return prisma.artwork.findMany({
    where: { published: true },
    select: REQUEST_ARTWORK_SELECT,
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }, { id: "asc" }],
  })
}

async function findPublishedRequestArtwork(slug: string) {
  const { prisma } = await import("@/db/client")

  return prisma.artwork.findFirst({
    where: { slug, published: true },
    select: REQUEST_ARTWORK_SELECT,
  })
}

async function findPublishedRequestServices() {
  const { prisma } = await import("@/db/client")

  return prisma.service.findMany({
    where: { published: true },
    select: REQUEST_SERVICE_SELECT,
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }, { slug: "asc" }],
  })
}

async function findPublishedRequestService(slug: string) {
  const { prisma } = await import("@/db/client")

  return prisma.service.findFirst({
    where: { slug, published: true },
    select: REQUEST_SERVICE_SELECT,
  })
}

export {
  REQUEST_ARTWORK_SELECT,
  REQUEST_SERVICE_SELECT,
  findPublishedRequestArtwork,
  findPublishedRequestArtworks,
  findPublishedRequestService,
  findPublishedRequestServices,
}
