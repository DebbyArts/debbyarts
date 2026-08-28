import type {
  SeedAssetLoader,
  SeedTransaction,
} from "@/db/seed/core/seed-runner"
import type { ServiceSeedData } from "@/db/seed/domains/service/service.seed-data"
import type { LoadedSeedImage } from "@/db/seed/media/asset-loader"
import { seedServiceCoverStoragePath } from "@/db/seed/media/storage-paths"

type PreparedServiceImage = LoadedSeedImage & {
  storagePath: string
}

type PreparedService = {
  coverImage: PreparedServiceImage | null
  item: ServiceSeedData
}

async function prepareServiceSeed(
  item: ServiceSeedData,
  loadImage: SeedAssetLoader
): Promise<PreparedService> {
  return {
    item,
    coverImage: item.primaryImage
      ? {
          ...(await loadImage(item.primaryImage)),
          storagePath: seedServiceCoverStoragePath(item.slug),
        }
      : null,
  }
}

async function persistServiceSeed(
  transaction: SeedTransaction,
  preparedServices: readonly PreparedService[]
) {
  for (const prepared of preparedServices) {
    const { coverImage, item } = prepared
    const data = {
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

    await transaction.service.upsert({
      where: { slug: item.slug },
      create: data,
      update: data,
    })
  }
}

function serviceSeedImages(preparedServices: readonly PreparedService[]) {
  return preparedServices.flatMap((item) => (item.coverImage ? [item.coverImage] : []))
}

export {
  persistServiceSeed,
  prepareServiceSeed,
  serviceSeedImages,
  type PreparedService,
}
