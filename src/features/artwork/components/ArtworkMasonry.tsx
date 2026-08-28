import { motion } from "motion/react"
import type { RefObject } from "react"

import { ArtworkMedia } from "@/features/artwork/components/ArtworkMedia"
import type { ArtworkProjection } from "@/features/artwork/types"
import { distributeArtworks } from "@/features/artwork/utils/artwork-gallery.utils"
import { cn } from "@/shared/utils/cn"

type ArtworkMasonryProps = {
  artworks: ArtworkProjection[]
  className: string
  columnCount: number
  onOpen: (index: number) => void
  openerRef: RefObject<HTMLButtonElement | null>
}

function ArtworkMasonry({
  artworks,
  className,
  columnCount,
  onOpen,
  openerRef,
}: ArtworkMasonryProps) {
  const columns = distributeArtworks(artworks, columnCount)
  const artworkIndices = new Map(
    artworks.map((artwork, index) => [artwork.slug, index])
  )

  return (
    <div className={className}>
      {columns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className={cn(
            "flex min-w-0 flex-col gap-7 lg:gap-10",
            columnIndex % 2 === 1 && "pt-10 lg:pt-20",
            columnIndex === 2 && "lg:pt-[14.375rem]"
          )}
        >
          {column.map((artwork) => {
            const artworkIndex = artworkIndices.get(artwork.slug) ?? 0
            const aspectRatio =
              artwork.imageWidth && artwork.imageHeight
                ? `${artwork.imageWidth} / ${artwork.imageHeight}`
                : "4 / 5"

            return (
              <motion.button
                key={artwork.slug}
                type="button"
                aria-label={`Open ${artwork.title}`}
                onClick={(event) => {
                  openerRef.current = event.currentTarget
                  onOpen(artworkIndex)
                }}
                className="w-full text-left"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                whileTap={{ y: -1, scale: 0.99 }}
                transition={{
                  duration: 0.38,
                  delay: (artworkIndex % 4) * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <span className="block overflow-hidden">
                  <motion.span
                    className="block"
                    whileHover={{ scale: 1.025 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArtworkMedia
                      alt={artwork.imageAlt}
                      src={artwork.imageSrc}
                      sizes="(max-width: 359px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      eager={artworkIndex < 3}
                      className="w-full bg-surface-subtle"
                      style={{ aspectRatio }}
                    />
                  </motion.span>
                </span>
                <span className="mt-2 flex flex-col gap-1 lg:mt-3 lg:flex-row lg:items-center lg:justify-between">
                  <span className="font-display text-[1.1875rem] leading-[1.375rem] uppercase lg:text-[1.5625rem] lg:leading-7">
                    {artwork.title}
                  </span>
                  <span className="hidden text-[0.6875rem] leading-4 font-extrabold tracking-label text-primary uppercase lg:inline">
                    {artwork.categoryItemLabel}
                  </span>
                </span>
              </motion.button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export { ArtworkMasonry }
