import type { Prisma } from "@/db/generated/prisma/client"

import type { FeaturedArtworkQuery } from "@/features/home/repositories/featured-artwork.repository"

type HomeArtworkRecord = Prisma.ArtworkGetPayload<{
  select: typeof FeaturedArtworkQuery.select
}>

type HomeArtwork = Omit<HomeArtworkRecord, "primaryImagePath"> & {
  primaryImageUrl: string | null
}

type FeaturedArtworkResult =
  | { status: "ready"; artwork: HomeArtwork[] }
  | { status: "unavailable" }

type HomePageProps = {
  featuredArtwork: FeaturedArtworkResult
}

export type {
  FeaturedArtworkResult,
  HomeArtwork,
  HomeArtworkRecord,
  HomePageProps,
}
