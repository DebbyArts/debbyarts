import {
  seedArtwork,
  seedServices,
  type ArtworkManifestItem,
  type SeedImage,
  type ServiceManifestItem,
} from "@/db/seed/content-manifest"
import { SeedManifestError, validateSeedManifest } from "@/db/seed/manifest-validation"
import {
  seedArtworkAdditionalStoragePath,
  seedArtworkAdditionalStoragePathPrefix,
  seedArtworkCoverStoragePath,
  seedServiceCoverStoragePath,
} from "@/db/seed/storage-paths"
import type { LoadedSeedImage } from "@/db/seed/seed-assets"

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
        artworkImages: {
          select: { displayOrder: true; storagePath: true }
        }
      }
    }) => Promise<{
      artworkImages: { displayOrder: number; storagePath: string }[]
    } | null>
  }
  $transaction: <T>(
    callback: (transaction: SeedTransaction) => Promise<T>
  ) => Promise<T>
}

type PreparedSeedImage = LoadedSeedImage & {
  storagePath: string
}

type PreparedArtwork = {
  additionalImages: PreparedSeedImage[]
  coverImage: PreparedSeedImage
  item: ArtworkManifestItem
}

type PreparedService = {
  coverImage: PreparedSeedImage | null
  item: ServiceManifestItem
}

type SeedResult = {
  artwork: number
  artworkImages: number
  services: number
  storageObjects: number
}

async function prepareImage(
  image: SeedImage,
  storagePath: string,
  loadImage: SeedAssetLoader
) {
  return { ...(await loadImage(image)), storagePath }
}

async function prepareArtwork(
  item: ArtworkManifestItem,
  loadImage: SeedAssetLoader
): Promise<PreparedArtwork> {
  return {
    item,
    coverImage: await prepareImage(
      item.primaryImage,
      seedArtworkCoverStoragePath(item.slug),
      loadImage
    ),
    additionalImages: await Promise.all(
      item.additionalImages.map((image, index) =>
        prepareImage(
          image,
          seedArtworkAdditionalStoragePath(item.slug, index + 1),
          loadImage
        )
      )
    ),
  }
}

async function prepareService(
  item: ServiceManifestItem,
  loadImage: SeedAssetLoader
): Promise<PreparedService> {
  return {
    item,
    coverImage: item.primaryImage
      ? await prepareImage(
          item.primaryImage,
          seedServiceCoverStoragePath(item.slug),
          loadImage
        )
      : null,
  }
}

function artworkData(prepared: PreparedArtwork) {
  const { coverImage, item } = prepared
  return {
    askQuantity: item.askQuantity,
    availability: item.availability,
    availableSizes: [...item.availableSizes],
    category: item.category,
    description: item.description,
    displayedPieceDimensions: item.displayedPieceDimensions,
    displayOrder: item.displayOrder,
    featured: item.featured,
    framingEnabled: item.framingEnabled,
    framingOptions: [...item.framingOptions],
    mediumFormat: item.mediumFormat,
    priceAmount: item.priceAmount,
    pricingMode: item.pricingMode,
    primaryImageAlt: item.primaryImage.alt,
    primaryImageHeight: coverImage.height,
    primaryImagePath: coverImage.storagePath,
    primaryImageWidth: coverImage.width,
    published: item.published,
    slug: item.slug,
    title: item.title,
  }
}

function serviceData(prepared: PreparedService) {
  const { coverImage, item } = prepared
  return {
    askColour: item.requestDefaults.askColour,
    askDesignReadiness: item.requestDefaults.askDesignReadiness,
    askFinish: item.requestDefaults.askFinish,
    askMaterial: item.requestDefaults.askMaterial,
    askQuantity: item.requestDefaults.askQuantity,
    askSizeFormat: item.requestDefaults.askSizeFormat,
    description: item.description,
    displayOrder: item.displayOrder,
    group: item.group,
    materialOptions: [...item.requestDefaults.materialOptions],
    name: item.name,
    priceAmount: item.priceAmount,
    pricingMode: item.pricingMode,
    primaryImageAlt: item.primaryImage?.alt ?? null,
    primaryImageHeight: coverImage?.height ?? null,
    primaryImagePath: coverImage?.storagePath ?? null,
    primaryImageWidth: coverImage?.width ?? null,
    published: item.published,
    sizeFormatOptions: [...item.requestDefaults.sizeFormatOptions],
    slug: item.slug,
  }
}

async function assertNoAdditionalImageOrderConflicts(
  database: SeedDatabase,
  artwork: readonly ArtworkManifestItem[]
) {
  for (const item of artwork) {
    if (!item.additionalImages.length) continue

    const existing = await database.artwork.findUnique({
      where: { slug: item.slug },
      select: {
        artworkImages: {
          select: { displayOrder: true, storagePath: true },
        },
      },
    })
    if (!existing) continue

    const seedPrefix = seedArtworkAdditionalStoragePathPrefix(item.slug)
    const curatedOrders = new Set(
      item.additionalImages.map((_, index) => index + 1)
    )
    const conflict = existing.artworkImages.find(
      (image) =>
        curatedOrders.has(image.displayOrder) &&
        !image.storagePath.startsWith(seedPrefix)
    )

    if (conflict) {
      throw new SeedManifestError(
        `Seeded Artwork ${item.slug} has an Admin gallery image at display order ${conflict.displayOrder}. Move that image before rerunning the seed.`
      )
    }
  }
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
  artwork?: readonly ArtworkManifestItem[]
  services?: readonly ServiceManifestItem[]
}): Promise<SeedResult> {
  validateSeedManifest(artwork, services)
  // Check before any upload so an Admin image at a curated position cannot
  // trigger a later database constraint failure or leave unused Storage files.
  await assertNoAdditionalImageOrderConflicts(database, artwork)

  const [preparedArtwork, preparedServices] = await Promise.all([
    Promise.all(artwork.map((item) => prepareArtwork(item, loadImage))),
    Promise.all(services.map((item) => prepareService(item, loadImage))),
  ])
  const storageObjects = [
    ...preparedArtwork.flatMap((item) => [
      item.coverImage,
      ...item.additionalImages,
    ]),
    ...preparedServices.flatMap((item) =>
      item.coverImage ? [item.coverImage] : []
    ),
  ]

  for (const image of storageObjects) {
    await storage.upload(image.storagePath, image.buffer)
  }

  await database.$transaction(async (transaction) => {
    for (const prepared of preparedArtwork) {
      const record = await transaction.artwork.upsert({
        where: { slug: prepared.item.slug },
        create: artworkData(prepared),
        update: artworkData(prepared),
      })

      await transaction.artworkImage.deleteMany({
        where: {
          artworkId: record.id,
          storagePath: {
            startsWith: seedArtworkAdditionalStoragePathPrefix(
              prepared.item.slug
            ),
          },
        },
      })
      if (prepared.additionalImages.length) {
        await transaction.artworkImage.createMany({
          data: prepared.additionalImages.map((image, index) => ({
            altText: prepared.item.additionalImages[index].alt,
            artworkId: record.id,
            displayOrder: index + 1,
            height: image.height,
            storagePath: image.storagePath,
            width: image.width,
          })),
        })
      }
    }

    for (const prepared of preparedServices) {
      await transaction.service.upsert({
        where: { slug: prepared.item.slug },
        create: serviceData(prepared),
        update: serviceData(prepared),
      })
    }
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
}
