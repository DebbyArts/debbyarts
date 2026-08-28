import { SeedError } from "@/db/seed/core/seed.error"
import type {
  SeedAssetLoader,
  SeedDatabase,
  SeedTransaction,
} from "@/db/seed/core/seed-runner"
import type { ArtworkSeedData } from "@/db/seed/domains/artwork/artwork.seed-data"
import type { LoadedSeedImage } from "@/db/seed/media/asset-loader"
import {
  seedArtworkAdditionalStoragePath,
  seedArtworkAdditionalStoragePathPrefix,
  seedArtworkCoverStoragePath,
} from "@/db/seed/media/storage-paths"

type PreparedArtworkImage = LoadedSeedImage & {
  storagePath: string
}

type PreparedArtwork = {
  additionalImages: PreparedArtworkImage[]
  coverImage: PreparedArtworkImage
  item: ArtworkSeedData
}

async function prepareArtworkSeed(
  item: ArtworkSeedData,
  loadImage: SeedAssetLoader
): Promise<PreparedArtwork> {
  async function prepareImage(image: ArtworkSeedData["primaryImage"], storagePath: string) {
    return { ...(await loadImage(image)), storagePath }
  }

  return {
    item,
    coverImage: await prepareImage(
      item.primaryImage,
      seedArtworkCoverStoragePath(item.slug)
    ),
    additionalImages: await Promise.all(
      item.additionalImages.map((image, index) =>
        prepareImage(
          image,
          seedArtworkAdditionalStoragePath(item.slug, index + 1)
        )
      )
    ),
  }
}

async function assertArtworkSeedImageOrderSafety(
  database: SeedDatabase,
  artwork: readonly ArtworkSeedData[]
) {
  for (const item of artwork) {
    if (!item.additionalImages.length) continue

    const existing = await database.artwork.findUnique({
      where: { slug: item.slug },
      select: {
        additionalImages: {
          select: { displayOrder: true, storagePath: true },
        },
      },
    })
    if (!existing) continue

    const seedPrefix = seedArtworkAdditionalStoragePathPrefix(item.slug)
    const curatedOrders = new Set(
      item.additionalImages.map((_, index) => index + 1)
    )
    const conflict = existing.additionalImages.find(
      (image) =>
        curatedOrders.has(image.displayOrder) &&
        !image.storagePath.startsWith(seedPrefix)
    )

    if (conflict) {
      throw new SeedError(
        `Seeded Artwork ${item.slug} has an Admin gallery image at display order ${conflict.displayOrder}. Move that image before rerunning the seed.`
      )
    }
  }
}

async function persistArtworkSeed(
  transaction: SeedTransaction,
  preparedArtwork: readonly PreparedArtwork[]
) {
  for (const prepared of preparedArtwork) {
    const { coverImage, item } = prepared
    const data = {
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
    const record = await transaction.artwork.upsert({
      where: { slug: item.slug },
      create: data,
      update: data,
    })

    await transaction.artworkImage.deleteMany({
      where: {
        artworkId: record.id,
        storagePath: {
          startsWith: seedArtworkAdditionalStoragePathPrefix(item.slug),
        },
      },
    })
    if (prepared.additionalImages.length) {
      await transaction.artworkImage.createMany({
        data: prepared.additionalImages.map((image, index) => ({
          altText: item.additionalImages[index].alt,
          artworkId: record.id,
          displayOrder: index + 1,
          height: image.height,
          storagePath: image.storagePath,
          width: image.width,
        })),
      })
    }
  }
}

function artworkSeedImages(preparedArtwork: readonly PreparedArtwork[]) {
  return preparedArtwork.flatMap((item) => [
    item.coverImage,
    ...item.additionalImages,
  ])
}

export {
  artworkSeedImages,
  assertArtworkSeedImageOrderSafety,
  persistArtworkSeed,
  prepareArtworkSeed,
  type PreparedArtwork,
}
