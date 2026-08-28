import { SeedError } from "@/db/seed/core/seed.error"
import type { ServiceSeedData } from "@/db/seed/domains/service/service.seed-data"
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

function validateServiceSeedData(items: readonly ServiceSeedData[]) {
  const slugs = new Set<string>()
  const displayOrders = new Set<number>()

  for (const service of items) {
    try {
      assertSeedSlug(service.slug)
    } catch {
      throw new SeedError(`Service seed manifest has an invalid slug: ${service.slug}.`)
    }
    if (slugs.has(service.slug)) {
      throw new SeedError(`Service seed manifest has a duplicate slug: ${service.slug}.`)
    }
    slugs.add(service.slug)

    if (!Number.isInteger(service.displayOrder) || service.displayOrder < 1) {
      throw new SeedError("Service seed manifest display order must be a positive integer.")
    }
    if (displayOrders.has(service.displayOrder)) {
      throw new SeedError("Service seed manifest has a duplicate display order.")
    }
    displayOrders.add(service.displayOrder)

    if (service.pricingMode !== "NONE" || service.priceAmount !== null) {
      throw new SeedError(`${service.slug} must not invent a public price.`)
    }
    if (service.published && !service.primaryImage) {
      throw new SeedError(
        `${service.slug} cannot be published without a confirmed cover image.`
      )
    }
    if (service.primaryImage) {
      assertImage(service.primaryImage, `${service.slug} cover image`)
    }
    if (service.requestDefaults.askSizeFormat && !service.requestDefaults.sizeFormatOptions.length) {
      throw new SeedError(
        `${service.slug} cannot ask for size or format without confirmed options.`
      )
    }
    if (service.requestDefaults.askMaterial || service.requestDefaults.materialOptions.length) {
      throw new SeedError(
        `${service.slug} cannot ask for materials without confirmed options.`
      )
    }
  }
}

export { validateServiceSeedData }
