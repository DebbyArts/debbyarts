"use client"

import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import { useMemo, useRef, useState } from "react"

import { EmptyState } from "@/components/ui/states/empty"
import { Button } from "@/components/ui/button"
import {
  ALL_ARTWORK,
  ARTWORK_CATEGORY_LABELS,
  COMMISSION_REQUEST_HREF,
} from "@/features/artwork/constants"
import { ArtworkLightbox } from "@/features/artwork/components/ArtworkLightbox"
import { ArtworkMasonry } from "@/features/artwork/components/ArtworkMasonry"
import type {
  ArtworkFilter,
  ArtworkProjection,
} from "@/features/artwork/types"
import {
  filterArtworks,
  getUsefulArtworkCategories,
} from "@/features/artwork/utils/artwork-gallery.utils"
import { cn } from "@/lib/utils"

type ArtworkGalleryProps = {
  artworks: ArtworkProjection[]
}

function ArtworkGallery({ artworks }: ArtworkGalleryProps) {
  const [filter, setFilter] = useState<ArtworkFilter>(ALL_ARTWORK)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const openerRef = useRef<HTMLButtonElement>(null)
  const usefulCategories = useMemo(
    () => getUsefulArtworkCategories(artworks),
    [artworks]
  )
  const filteredArtworks = useMemo(
    () => filterArtworks(artworks, filter),
    [artworks, filter]
  )

  function selectFilter(nextFilter: ArtworkFilter) {
    setFilter(nextFilter)
    setSelectedIndex(null)
  }

  return (
    <>
      <section
        aria-labelledby="gallery-title"
        className="relative border-b-2 border-border py-14 lg:py-[4.5rem]"
      >
        <motion.div
          className="page-container flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-20"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="flex max-w-[48.75rem] flex-col gap-5">
            <div className="flex items-center gap-3.5">
              <span aria-hidden="true" className="h-2 w-[3.625rem] bg-primary" />
              <p className="type-label">Original artwork</p>
            </div>
            <h1 id="gallery-title" className="type-display uppercase">
              Art &amp;
              <br />
              Gallery
            </h1>
          </div>
          <div className="max-w-[26.25rem] lg:pb-2">
            <p className="text-[1.0625rem] leading-[1.625rem] lg:text-xl lg:leading-[1.875rem]">
              Paintings, portraits and framed creative pieces—never printed
              production.
            </p>
            <p className="mt-6 hidden text-[0.8125rem] leading-5 text-muted-foreground lg:block">
              Open any piece to view it closely or ask about the artwork.
            </p>
          </div>
        </motion.div>
        <span
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-2 bg-info lg:w-[1.125rem]"
        />
      </section>

      {usefulCategories.length > 0 ? (
        <section
          aria-label="Artwork filters"
          className="border-b border-border bg-card"
        >
          <div className="page-container flex flex-wrap items-center justify-between gap-3 py-5 lg:py-[1.875rem]">
            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={filter === ALL_ARTWORK}
                onClick={() => selectFilter(ALL_ARTWORK)}
              >
                All Artwork
              </FilterButton>
              {usefulCategories.map((category) => (
                <FilterButton
                  key={category}
                  active={filter === category}
                  onClick={() => selectFilter(category)}
                >
                  {ARTWORK_CATEGORY_LABELS[category]}
                </FilterButton>
              ))}
            </div>
            <p aria-live="polite" className="type-label text-muted-foreground">
              {filteredArtworks.length}{" "}
              {filteredArtworks.length === 1 ? "piece" : "pieces"}
            </p>
          </div>
        </section>
      ) : null}

      <section aria-label="Artwork catalogue" className="page-container py-10 lg:py-[4.5rem]">
        {filteredArtworks.length > 0 ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <ArtworkMasonry
                artworks={filteredArtworks}
                columnCount={1}
                openerRef={openerRef}
                onOpen={setSelectedIndex}
                className="grid grid-cols-1 gap-4 min-[360px]:hidden"
              />
              <ArtworkMasonry
                artworks={filteredArtworks}
                columnCount={2}
                openerRef={openerRef}
                onOpen={setSelectedIndex}
                className="hidden grid-cols-2 gap-4 min-[360px]:grid lg:hidden"
              />
              <ArtworkMasonry
                artworks={filteredArtworks}
                columnCount={3}
                openerRef={openerRef}
                onOpen={setSelectedIndex}
                className="hidden grid-cols-[minmax(0,0.947fr)_minmax(0,1.158fr)_minmax(0,1fr)] items-start gap-7 lg:grid"
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <EmptyState
            visual="A"
            title="The gallery is being prepared"
            description="Published artwork will appear here as soon as each piece is ready to share."
            className="min-h-[22rem] border-solid bg-background"
          />
        )}
      </section>

      <section className="border-y-2 border-border bg-info py-12 lg:py-[4.5rem]">
        <div className="page-container flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-[47.5rem] flex-col gap-3">
            <p className="type-label">Like the style?</p>
            <h2 className="type-h2 max-w-[47.5rem] uppercase">
              Commission something similar.
            </h2>
          </div>
          <Button asChild variant="secondary" size="lg" className="self-start">
            <Link href={COMMISSION_REQUEST_HREF}>Make an art request ↗</Link>
          </Button>
        </div>
      </section>

      <ArtworkLightbox
        artworks={filteredArtworks}
        selectedIndex={selectedIndex}
        openerRef={openerRef}
        onSelect={setSelectedIndex}
        onClose={() => setSelectedIndex(null)}
      />
    </>
  )
}

function FilterButton({
  active,
  className,
  ...props
}: React.ComponentProps<"button"> & { active: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "min-h-11 border border-border px-4 text-[0.8125rem] leading-5 font-semibold transition-colors hover:bg-muted lg:px-5 lg:text-sm",
        active && "bg-secondary font-extrabold text-secondary-foreground",
        className
      )}
      {...props}
    />
  )
}

export { ArtworkGallery }
