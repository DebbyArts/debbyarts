import type {
  ArtworkManifestItem,
  SeedImage,
  ServiceManifestItem,
} from "@/db/seed/content-manifest"
import { assertSeedSlug } from "@/db/seed/storage-paths"

class SeedManifestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "SeedManifestError"
  }
}

function assertImage(image: SeedImage, label: string) {
  if (!image.path.startsWith("images/seed/") || image.path.includes("..")) {
    throw new SeedManifestError(`${label} must reference a tracked seed asset.`)
  }
  if (!image.alt.trim()) {
    throw new SeedManifestError(`${label} requires useful alt text.`)
  }
  if (!Number.isInteger(image.width) || !Number.isInteger(image.height)) {
    throw new SeedManifestError(`${label} dimensions must be whole numbers.`)
  }
}

function assertUniqueSlugs(items: readonly { slug: string }[], label: string) {
  const slugs = new Set<string>()
  for (const item of items) {
    try {
      assertSeedSlug(item.slug)
    } catch {
      throw new SeedManifestError(`${label} has an invalid slug: ${item.slug}.`)
    }
    if (slugs.has(item.slug)) {
      throw new SeedManifestError(`${label} has a duplicate slug: ${item.slug}.`)
    }
    slugs.add(item.slug)
  }
}

function assertUniqueDisplayOrders(
  items: readonly { displayOrder: number }[],
  label: string
) {
  const orders = new Set<number>()
  for (const item of items) {
    if (!Number.isInteger(item.displayOrder) || item.displayOrder < 1) {
      throw new SeedManifestError(`${label} display order must be a positive integer.`)
    }
    if (orders.has(item.displayOrder)) {
      throw new SeedManifestError(`${label} has a duplicate display order.`)
    }
    orders.add(item.displayOrder)
  }
}

function validateArtworkManifest(items: readonly ArtworkManifestItem[]) {
  assertUniqueSlugs(items, "Artwork seed manifest")
  assertUniqueDisplayOrders(items, "Artwork seed manifest")

  for (const artwork of items) {
    if (artwork.availability !== "MADE_TO_ORDER") {
      throw new SeedManifestError(
        `${artwork.slug} must use MADE_TO_ORDER until availability is confirmed.`
      )
    }
    if (artwork.pricingMode !== "NONE" || artwork.priceAmount !== null) {
      throw new SeedManifestError(`${artwork.slug} must not invent a public price.`)
    }
    if (artwork.mediumFormat !== null || artwork.displayedPieceDimensions !== null) {
      throw new SeedManifestError(`${artwork.slug} must leave unknown media and dimensions empty.`)
    }
    if (artwork.availableSizes.length || artwork.framingEnabled || artwork.framingOptions.length) {
      throw new SeedManifestError(`${artwork.slug} has unconfirmed Artwork request options.`)
    }
    if (artwork.additionalImages.length > 7) {
      throw new SeedManifestError(`${artwork.slug} exceeds the seven additional-image limit.`)
    }

    assertImage(artwork.primaryImage, `${artwork.slug} cover image`)
    artwork.additionalImages.forEach((image, index) => {
      assertImage(image, `${artwork.slug} additional image ${index + 1}`)
    })
  }
}

function validateServiceManifest(items: readonly ServiceManifestItem[]) {
  assertUniqueSlugs(items, "Service seed manifest")
  assertUniqueDisplayOrders(items, "Service seed manifest")

  for (const service of items) {
    const { requestDefaults } = service
    if (service.pricingMode !== "NONE" || service.priceAmount !== null) {
      throw new SeedManifestError(`${service.slug} must not invent a public price.`)
    }
    if (service.published && !service.primaryImage) {
      throw new SeedManifestError(
        `${service.slug} cannot be published without a confirmed cover image.`
      )
    }
    if (service.primaryImage) {
      assertImage(service.primaryImage, `${service.slug} cover image`)
    }
    if (requestDefaults.askSizeFormat && !requestDefaults.sizeFormatOptions.length) {
      throw new SeedManifestError(
        `${service.slug} cannot ask for size or format without confirmed options.`
      )
    }
    if (requestDefaults.askMaterial || requestDefaults.materialOptions.length) {
      throw new SeedManifestError(
        `${service.slug} cannot ask for materials without confirmed options.`
      )
    }
  }
}

function validateSeedManifest(
  artwork: readonly ArtworkManifestItem[],
  services: readonly ServiceManifestItem[]
) {
  validateArtworkManifest(artwork)
  validateServiceManifest(services)
}

export {
  SeedManifestError,
  validateSeedManifest,
}
