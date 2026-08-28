import { SeedError } from "@/db/seed/core/seed.error"
import type { ArtworkSeedData } from "@/db/seed/domains/artwork/artwork.seed-data"
import type { SeedImage } from "@/db/seed/media/asset-loader"
import { assertSeedSlug } from "@/db/seed/media/storage-paths"

function assertImage(image: SeedImage, label: string) {
  if (!image.path.startsWith("images/seed/") || image.path.includes("..")) {
    throw new SeedError(`${label} must reference a tracked seed asset.`)
  }
  if (!image.alt.trim()) {
    throw new SeedError(`${label} requires useful alt text.`)
  }
  if (!Number.isInteger(image.width) || !Number.isInteger(image.height)) {
    throw new SeedError(`${label} dimensions must be whole numbers.`)
  }
}

function validateArtworkSeedData(items: readonly ArtworkSeedData[]) {
  const slugs = new Set<string>()
  const displayOrders = new Set<number>()

  for (const artwork of items) {
    try {
      assertSeedSlug(artwork.slug)
    } catch {
      throw new SeedError(`Artwork seed manifest has an invalid slug: ${artwork.slug}.`)
    }
    if (slugs.has(artwork.slug)) {
      throw new SeedError(`Artwork seed manifest has a duplicate slug: ${artwork.slug}.`)
    }
    slugs.add(artwork.slug)

    if (!Number.isInteger(artwork.displayOrder) || artwork.displayOrder < 1) {
      throw new SeedError("Artwork seed manifest display order must be a positive integer.")
    }
    if (displayOrders.has(artwork.displayOrder)) {
      throw new SeedError("Artwork seed manifest has a duplicate display order.")
    }
    displayOrders.add(artwork.displayOrder)

    if (artwork.availability !== "MADE_TO_ORDER") {
      throw new SeedError(
        `${artwork.slug} must use MADE_TO_ORDER until availability is confirmed.`
      )
    }
    if (artwork.pricingMode !== "NONE" || artwork.priceAmount !== null) {
      throw new SeedError(`${artwork.slug} must not invent a public price.`)
    }
    if (artwork.mediumFormat !== null || artwork.displayedPieceDimensions !== null) {
      throw new SeedError(`${artwork.slug} must leave unknown media and dimensions empty.`)
    }
    if (artwork.availableSizes.length || artwork.framingEnabled || artwork.framingOptions.length) {
      throw new SeedError(`${artwork.slug} has unconfirmed Artwork request options.`)
    }
    if (artwork.additionalImages.length > 7) {
      throw new SeedError(`${artwork.slug} exceeds the seven additional-image limit.`)
    }

    assertImage(artwork.primaryImage, `${artwork.slug} cover image`)
    artwork.additionalImages.forEach((image, index) => {
      assertImage(image, `${artwork.slug} additional image ${index + 1}`)
    })
  }
}

export { validateArtworkSeedData }
