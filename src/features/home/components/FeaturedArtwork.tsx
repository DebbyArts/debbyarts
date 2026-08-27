import Link from "next/link"

import { Container } from "@/components/ui/container"
import { Reveal } from "@/components/shared/motion/reveal"
import { Button } from "@/components/ui/button"
import type { FeaturedArtworkResult } from "@/features/home/types"
import { ArtworkCard } from "./ArtworkCard"
import { Eyebrow } from "./Eyebrow"

function FeaturedArtwork({ result }: { result: FeaturedArtworkResult }) {
  const artwork = result.status === "ready" ? result.artwork : []

  return (
    <section aria-labelledby="featured-artwork-heading" className="bg-background">
      <Container className="border-t border-border py-20 min-[1400px]:min-h-[68.75rem] min-[1400px]:px-[4.25rem] min-[1400px]:pt-28 min-[1400px]:pb-[7.5rem]">
        <Reveal className="flex flex-col gap-6 min-[1400px]:flex-row min-[1400px]:items-end min-[1400px]:justify-between">
          <div className="flex flex-col gap-[1.125rem]">
            <Eyebrow className="bg-info text-info-foreground">
              A CURATED SELECTION
            </Eyebrow>
            <h2 id="featured-artwork-heading" className="type-h2">
              FEATURED
              <br />
              ARTWORK
            </h2>
          </div>
          <div className="flex max-w-[26.875rem] flex-col gap-4 min-[1400px]:pb-2">
            <p className="text-base leading-[1.625rem] text-muted-foreground min-[1400px]:text-lg min-[1400px]:leading-7">
              A small selection of original artwork and portraits. Open the
              gallery to explore more.
            </p>
            <span aria-hidden="true" className="h-2 w-[7.5rem] bg-primary" />
          </div>
        </Reveal>

        {result.status === "unavailable" ? (
          <div
            role="alert"
            className="mt-14 flex min-h-72 flex-col items-start justify-end gap-5 rounded-md border border-border bg-card p-8 min-[1400px]:min-h-[31rem] min-[1400px]:p-12"
          >
            <p className="type-h3 max-w-[35rem]">
              FEATURED ARTWORK IS TEMPORARILY UNAVAILABLE.
            </p>
            <p className="max-w-copy text-muted-foreground">
              The catalogue could not be loaded right now. Please try Art &amp;
              Gallery again shortly.
            </p>
          </div>
        ) : artwork.length > 0 ? (
          <div className="mt-14 grid gap-12 sm:grid-cols-2 md:grid-cols-3 desktop:grid-cols-[minmax(0,20.375rem)_minmax(0,25.875rem)_minmax(0,18.75rem)] desktop:items-start desktop:justify-between">
            {artwork.map((item, index) => (
              <ArtworkCard key={item.id} artwork={item} index={index} />
            ))}
          </div>
        ) : (
          <div
            role="status"
            className="mt-14 flex min-h-72 flex-col items-start justify-end gap-5 rounded-md border border-border bg-muted p-8 min-[1400px]:min-h-[31rem] min-[1400px]:p-12"
          >
            <p className="type-h3 max-w-[35rem]">THE GALLERY IS BEING PREPARED.</p>
            <p className="max-w-copy text-muted-foreground">
              Featured artwork will appear here when confirmed pieces are
              published. You can still open Art &amp; Gallery to continue.
            </p>
          </div>
        )}

        <div className="mt-14 flex flex-col items-start justify-end gap-4 sm:flex-row sm:items-center desktop:mt-4">
          <p className="text-[0.8125rem] leading-[1.125rem] text-muted-foreground">
            Explore more original artwork and portrait work.
          </p>
          <Button asChild variant="outline" size="lg">
            <Link href="/art">Browse Art &amp; Gallery ↗</Link>
          </Button>
        </div>
      </Container>
    </section>
  )
}

export { FeaturedArtwork }
