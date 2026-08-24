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

type HomeArtworkRecord = Prisma.ArtworkGetPayload<{
  select: typeof featuredArtworkQuery.select
}>

type HomeArtwork = Omit<HomeArtworkRecord, "primaryImagePath"> & {
  primaryImageUrl: string | null
}

type FeaturedArtworkResult =
  | { status: "ready"; artwork: HomeArtwork[] }
  | { status: "unavailable" }

function resolvePublicArtworkImageUrl(objectPath: string | null): string | null {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET

  if (!objectPath || !projectUrl || !bucket) {
    return null
  }

  const pathSegments = objectPath.split("/")

  if (
    pathSegments.some(
      (segment) => !segment || segment === "." || segment === ".."
    )
  ) {
    return null
  }

  try {
    const publicObjectUrl = new URL(projectUrl)

    if (!["http:", "https:"].includes(publicObjectUrl.protocol)) {
      return null
    }

    const encodedBucket = encodeURIComponent(bucket)
    const encodedPath = pathSegments.map(encodeURIComponent).join("/")

    publicObjectUrl.pathname = `/storage/v1/object/public/${encodedBucket}/${encodedPath}`
    publicObjectUrl.search = ""
    publicObjectUrl.hash = ""

    return publicObjectUrl.toString()
  } catch {
    return null
  }
}

function projectHomeArtwork(artwork: HomeArtworkRecord): HomeArtwork {
  const { primaryImagePath, ...projection } = artwork

  return {
    ...projection,
    primaryImageUrl: resolvePublicArtworkImageUrl(primaryImagePath),
  }
}

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

    return { status: "ready", artwork: artwork.map(projectHomeArtwork) }
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
