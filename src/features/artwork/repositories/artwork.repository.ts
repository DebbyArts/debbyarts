import type { Prisma } from "@/db/generated/prisma/client"

const PUBLISHED_ARTWORK_QUERY = {
  where: { published: true },
  orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }, { id: "asc" }],
  select: {
    slug: true, title: true, description: true, category: true,
    mediumFormat: true, displayedPieceDimensions: true, availability: true,
    primaryImagePath: true, primaryImageAlt: true, primaryImageWidth: true,
    primaryImageHeight: true, pricingMode: true, priceAmount: true,
  },
} satisfies Prisma.ArtworkFindManyArgs

const REQUEST_ARTWORK_SELECT = {
  id: true, slug: true, title: true, category: true, primaryImagePath: true,
  primaryImageAlt: true, availableSizes: true, framingEnabled: true,
  framingOptions: true, askQuantity: true,
} satisfies Prisma.ArtworkSelect

async function findPublishedArtworks() {
  const { prisma } = await import("@/db/client")
  return prisma.artwork.findMany(PUBLISHED_ARTWORK_QUERY)
}

async function findPublishedRequestArtworks() {
  const { prisma } = await import("@/db/client")
  return prisma.artwork.findMany({
    where: { published: true }, select: REQUEST_ARTWORK_SELECT,
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }, { id: "asc" }],
  })
}

async function findPublishedRequestArtwork(slug: string) {
  const { prisma } = await import("@/db/client")
  return prisma.artwork.findFirst({
    where: { slug, published: true }, select: REQUEST_ARTWORK_SELECT,
  })
}

export {
  PUBLISHED_ARTWORK_QUERY,
  REQUEST_ARTWORK_SELECT,
  findPublishedArtworks,
  findPublishedRequestArtwork,
  findPublishedRequestArtworks,
}
