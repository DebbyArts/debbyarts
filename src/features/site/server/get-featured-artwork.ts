import type { Prisma } from "@/db/generated/prisma/client"

const featuredArtworkQuery = {
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

type HomeArtwork = Prisma.ArtworkGetPayload<{
  select: typeof featuredArtworkQuery.select
}>

type FeaturedArtworkResult =
  | { status: "ready"; artwork: HomeArtwork[] }
  | { status: "unavailable" }

async function getFeaturedArtwork(): Promise<FeaturedArtworkResult> {
  if (!process.env.DATABASE_URL) {
    console.warn(
      "Featured artwork is unavailable because DATABASE_URL is not configured."
    )
    return { status: "unavailable" }
  }

  try {
    const { prisma } = await import("@/db/client")
    const artwork = await prisma.artwork.findMany(featuredArtworkQuery)

    return { status: "ready", artwork }
  } catch (error) {
    console.error("Featured artwork could not be loaded.", error)
    return { status: "unavailable" }
  }
}

export {
  featuredArtworkQuery,
  getFeaturedArtwork,
  type FeaturedArtworkResult,
  type HomeArtwork,
}
