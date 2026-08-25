import type { Prisma } from "@/db/generated/prisma/client"

const FeaturedArtworkQuery = {
  where: {
    featured: true,
    published: true,
  },
  orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  take: 3,
  select: {
    id: true,
    slug: true,
    title: true,
    category: true,
    mediumFormat: true,
    primaryImagePath: true,
    primaryImageAlt: true,
    primaryImageWidth: true,
    primaryImageHeight: true,
  },
} satisfies Prisma.ArtworkFindManyArgs

async function findFeaturedArtwork() {
  const { prisma } = await import("@/db/client")
  return prisma.artwork.findMany(FeaturedArtworkQuery)
}

export { FeaturedArtworkQuery, findFeaturedArtwork }
