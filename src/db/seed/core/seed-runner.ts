import {
  artworkSeedImages,
  assertArtworkSeedImageOrderSafety,
  persistArtworkSeed,
  prepareArtworkSeed,
} from "@/db/seed/domains/artwork/artwork.seeder"
import { seedArtwork, type ArtworkSeedData } from "@/db/seed/domains/artwork/artwork.seed-data"
import { validateArtworkSeedData } from "@/db/seed/domains/artwork/artwork-seed.validation"
import {
  persistServiceSeed,
  prepareServiceSeed,
  serviceSeedImages,
} from "@/db/seed/domains/service/service.seeder"
import { seedServices, type ServiceSeedData } from "@/db/seed/domains/service/service.seed-data"
import { validateServiceSeedData } from "@/db/seed/domains/service/service-seed.validation"
import type { LoadedSeedImage, SeedImage } from "@/db/seed/media/asset-loader"

type SeedStorage = {
  upload: (path: string, buffer: Buffer) => Promise<unknown>
}

type SeedAssetLoader = (image: SeedImage) => Promise<LoadedSeedImage>

type SeedTransaction = {
  artwork: {
    upsert: (args: {
      where: { slug: string }
      create: Record<string, unknown>
      update: Record<string, unknown>
    }) => Promise<{ id: string }>
  }
  artworkImage: {
    createMany: (args: { data: Record<string, unknown>[] }) => Promise<unknown>
    deleteMany: (args: { where: Record<string, unknown> }) => Promise<unknown>
  }
  service: {
    upsert: (args: {
      where: { slug: string }
      create: Record<string, unknown>
      update: Record<string, unknown>
    }) => Promise<unknown>
  }
}

type SeedDatabase = {
  artwork: {
    findUnique: (args: {
      where: { slug: string }
      select: {
        additionalImages: {
          select: { displayOrder: true; storagePath: true }
        }
      }
    }) => Promise<{
      additionalImages: { displayOrder: number; storagePath: string }[]
    } | null>
  }
  $transaction: <T>(
    callback: (transaction: SeedTransaction) => Promise<T>
  ) => Promise<T>
}

type SeedResult = {
  artwork: number
  artworkImages: number
  services: number
  storageObjects: number
}

async function runSeed({
  database,
  loadImage,
  storage,
  artwork = seedArtwork,
  services = seedServices,
}: {
  database: SeedDatabase
  loadImage: SeedAssetLoader
  storage: SeedStorage
  artwork?: readonly ArtworkSeedData[]
  services?: readonly ServiceSeedData[]
}): Promise<SeedResult> {
  validateArtworkSeedData(artwork)
  validateServiceSeedData(services)
  // Check before any upload so an Admin image at a curated position cannot
  // trigger a later database constraint failure or leave unused Storage files.
  await assertArtworkSeedImageOrderSafety(database, artwork)

  const [preparedArtwork, preparedServices] = await Promise.all([
    Promise.all(artwork.map((item) => prepareArtworkSeed(item, loadImage))),
    Promise.all(services.map((item) => prepareServiceSeed(item, loadImage))),
  ])
  const storageObjects = [
    ...artworkSeedImages(preparedArtwork),
    ...serviceSeedImages(preparedServices),
  ]

  for (const image of storageObjects) {
    await storage.upload(image.storagePath, image.buffer)
  }

  await database.$transaction(async (transaction) => {
    await persistArtworkSeed(transaction, preparedArtwork)
    await persistServiceSeed(transaction, preparedServices)
  })

  return {
    artwork: preparedArtwork.length,
    artworkImages: preparedArtwork.reduce(
      (count, item) => count + item.additionalImages.length,
      0
    ),
    services: preparedServices.length,
    storageObjects: storageObjects.length,
  }
}

export {
  runSeed,
  type SeedAssetLoader,
  type SeedDatabase,
  type SeedResult,
  type SeedStorage,
  type SeedTransaction,
}
