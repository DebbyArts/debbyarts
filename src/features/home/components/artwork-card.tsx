import * as motion from "motion/react-client"

import { MediaImage } from "@/components/ui/media-image"
import { artworkCategoryLabels } from "@/features/home/constants"
import type { HomeArtwork } from "@/features/home/types"
import { cn } from "@/lib/utils"

function ArtworkCard({
  artwork,
  index,
}: {
  artwork: HomeArtwork
  index: number
}) {
  const category = artworkCategoryLabels[artwork.category]

  return (
    <motion.article
      className={cn(
        "flex min-w-0 flex-col gap-3",
        index === 0 && "desktop:mt-11",
        index === 2 && "desktop:mt-[5.125rem]"
      )}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.42, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className="overflow-hidden rounded-[0.625rem]">
        <motion.div whileHover={{ scale: 1.025 }} transition={{ duration: 0.2 }}>
          <MediaImage
            src={artwork.primaryImageUrl ?? undefined}
            alt={artwork.primaryImageAlt ?? artwork.title}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            fit="contain"
            fallback="Artwork image unavailable"
            className={cn(
              "aspect-[3/4] rounded-[0.625rem] border border-border bg-card",
              index === 1 && "min-[1400px]:aspect-square min-[1400px]:rounded-[0.75rem]"
            )}
          />
        </motion.div>
      </div>
      <div className="flex items-center justify-between gap-3 text-[0.6875rem] leading-3.5">
        <p
          className={cn(
            "font-extrabold tracking-label text-info",
            index === 1 && "text-primary",
            index === 2 && "text-warning-foreground"
          )}
        >
          {String(index + 1).padStart(2, "0")} · {category.toUpperCase()}
        </p>
        <p className="text-muted-foreground">
          {artwork.mediumFormat ?? category}
        </p>
      </div>
      <h3 className="font-display text-[1.75rem] leading-8">{artwork.title}</h3>
    </motion.article>
  )
}

export { ArtworkCard }
