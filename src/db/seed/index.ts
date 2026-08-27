import { prisma } from "@/db/client"
import { loadSeedImage } from "@/db/seed/seed-assets"
import { runSeed, type SeedDatabase } from "@/db/seed/seed-orchestrator"
import { uploadSeedCatalogueImage } from "@/db/seed/seed-storage"

async function main() {
  // Storage uploads finish before the single database transaction. If the
  // transaction fails, rerun the seed to recover those stable object paths.
  const result = await runSeed({
    database: prisma as unknown as SeedDatabase,
    loadImage: loadSeedImage,
    storage: { upload: uploadSeedCatalogueImage },
  })

  console.log(
    `Seeded ${result.artwork} Artwork records, ${result.artworkImages} additional ArtworkImage records, ${result.services} Service records, and ${result.storageObjects} Storage objects.`
  )
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Seed failed.")
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
