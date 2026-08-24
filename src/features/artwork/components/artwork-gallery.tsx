"use client"

import Link from "next/link"
import { type RefObject, useMemo, useRef, useState } from "react"

import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import {
  ALL_ARTWORK,
  COMMISSION_REQUEST_HREF,
  distributeArtworks,
  filterArtworks,
  getArtworkCategoryItemLabel,
  getArtworkCategoryLabel,
  getUsefulArtworkCategories,
  type ArtworkFilter,
  type ArtworkProjection,
} from "@/features/artwork/artwork-catalogue"
import { ArtworkLightbox } from "@/features/artwork/components/artwork-lightbox"
import { ArtworkMedia } from "@/features/artwork/components/artwork-media"
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
        <div className="page-container flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
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
        </div>
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
                  {getArtworkCategoryLabel(category)}
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
          <>
            <MasonryColumns
              artworks={filteredArtworks}
              columnCount={1}
              openerRef={openerRef}
              onOpen={setSelectedIndex}
              className="grid grid-cols-1 gap-4 min-[360px]:hidden"
            />
            <MasonryColumns
              artworks={filteredArtworks}
              columnCount={2}
              openerRef={openerRef}
              onOpen={setSelectedIndex}
              className="hidden grid-cols-2 gap-4 min-[360px]:grid lg:hidden"
            />
            <MasonryColumns
              artworks={filteredArtworks}
              columnCount={3}
              openerRef={openerRef}
              onOpen={setSelectedIndex}
              className="hidden grid-cols-[minmax(0,0.947fr)_minmax(0,1.158fr)_minmax(0,1fr)] items-start gap-7 lg:grid"
            />
          </>
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

type MasonryColumnsProps = {
  artworks: ArtworkProjection[]
  className: string
  columnCount: number
  onOpen: (index: number) => void
  openerRef: RefObject<HTMLButtonElement | null>
}

function MasonryColumns({
  artworks,
  className,
  columnCount,
  onOpen,
  openerRef,
}: MasonryColumnsProps) {
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
              <button
                key={artwork.slug}
                type="button"
                aria-label={`Open ${artwork.title}`}
                onClick={(event) => {
                  openerRef.current = event.currentTarget
                  onOpen(artworkIndex)
                }}
                className="w-full text-left transition-transform duration-200 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <ArtworkMedia
                  alt={artwork.imageAlt}
                  src={artwork.imageSrc}
                  sizes="(max-width: 359px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  eager={artworkIndex < 3}
                  className="w-full bg-surface-subtle"
                  style={{ aspectRatio }}
                />
                <span className="mt-2 flex flex-col gap-1 lg:mt-3 lg:flex-row lg:items-center lg:justify-between">
                  <span className="font-display text-[1.1875rem] leading-[1.375rem] uppercase lg:text-[1.5625rem] lg:leading-7">
                    {artwork.title}
                  </span>
                  <span className="hidden text-[0.6875rem] leading-4 font-extrabold tracking-label text-primary uppercase lg:inline">
                    {getArtworkCategoryItemLabel(artwork.category)}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      ))}
    </div>
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
