import Link from "next/link"

import { Container } from "@/components/ui/container"
import { MediaImage } from "@/components/ui/media-image"
import { Reveal } from "@/components/shared/motion/reveal"
import { Eyebrow } from "./Eyebrow"

function OfferRoutes() {
  return (
    <section aria-labelledby="offer-routes-heading" className="relative bg-background">
      <Container className="py-20 min-[1400px]:min-h-[82.5rem] min-[1400px]:px-16 min-[1400px]:pt-[6.75rem] min-[1400px]:pb-24">
        <div className="flex flex-col gap-6 min-[1400px]:flex-row min-[1400px]:items-end min-[1400px]:justify-between">
          <div className="flex flex-col gap-[1.125rem]">
            <Eyebrow className="bg-primary text-white">MADE IN THE STUDIO</Eyebrow>
            <h2 id="offer-routes-heading" className="type-h2">
              WHAT DEBBY ART &amp; PRINTS
              <br className="hidden min-[1400px]:block" /> CREATES
            </h2>
          </div>
          <p className="max-w-[24.375rem] text-base leading-[1.625rem] text-muted-foreground min-[1400px]:pb-2 min-[1400px]:text-lg min-[1400px]:leading-7">
            Explore original artwork, personalised products, print materials
            and branding.
          </p>
        </div>

        <Reveal className="mt-11 flex flex-col gap-5 border-y border-border bg-muted p-5 sm:grid sm:grid-cols-2 sm:items-start min-[1400px]:relative min-[1400px]:h-[53.75rem] min-[1400px]:block min-[1400px]:p-0">
          <Link
            href="/art"
            className="group flex items-end gap-4 rounded-md focus-visible:ring-3 focus-visible:ring-ring sm:col-span-2 min-[1400px]:absolute min-[1400px]:top-[3.875rem] min-[1400px]:left-10 min-[1400px]:h-[24.375rem] min-[1400px]:w-[45rem] min-[1400px]:gap-[1.875rem]"
          >
            <MediaImage
              loading="eager"
              src="/home-framed-portrait.jpg"
              alt="Framed portrait artwork by Debby Art & Prints"
              sizes="(min-width: 1024px) 292px, 140px"
              fit="contain"
              className="h-[11.6875rem] w-[8.75rem] shrink-0 rounded-[0.625rem] border border-border bg-card min-[1400px]:h-[24.25rem] min-[1400px]:w-[18.25rem]"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2 pb-1 min-[1400px]:gap-[1.125rem] min-[1400px]:pb-4">
              <Eyebrow className="min-h-7 px-2.5 text-[0.5625rem] bg-accent text-accent-foreground min-[1400px]:min-h-8 min-[1400px]:px-3.5 min-[1400px]:text-[0.6875rem]">
                ORIGINAL ARTWORK
              </Eyebrow>
              <h3 className="font-display text-[1.75rem] leading-[1.75rem] tracking-[-0.03em] min-[1400px]:text-4xl min-[1400px]:leading-10">
                ART &amp;
                <br /> PORTRAITS
              </h3>
              <p className="text-xs leading-[1.125rem] text-muted-foreground min-[1400px]:text-base min-[1400px]:leading-[1.625rem]">
                Paintings, portraits, custom artwork and framed creative pieces.
              </p>
              <span className="w-fit border-b-2 border-info text-[0.6875rem] leading-4 font-extrabold group-hover:text-primary min-[1400px]:text-[0.8125rem] min-[1400px]:leading-[1.125rem]">
                Open Art &amp; Gallery ↗
              </span>
            </div>
          </Link>

          <Link
            href="/services#personalised-products"
            className="group flex h-[10.375rem] gap-3 rounded-md border border-border bg-card p-3 focus-visible:ring-3 focus-visible:ring-ring min-[1400px]:absolute min-[1400px]:top-7 min-[1400px]:right-[2.625rem] min-[1400px]:h-[22.5rem] min-[1400px]:w-[26.875rem] min-[1400px]:gap-5 min-[1400px]:p-[1.375rem]"
          >
            <MediaImage
              loading="eager"
              src="/home-personalised-products.jpg"
              alt="Personalised printed product example"
              sizes="(min-width: 1024px) 166px, 140px"
              fit="contain"
              className="h-full w-[6.75rem] shrink-0 rounded-sm border border-border min-[1400px]:h-auto min-[1400px]:w-[10.375rem]"
            />
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 min-[1400px]:gap-5">
              <div className="flex flex-col gap-2 min-[1400px]:gap-3.5">
                <p className="text-[0.5625rem] leading-3 font-extrabold tracking-label text-primary min-[1400px]:text-[0.6875rem] min-[1400px]:leading-3.5">
                  MADE TO ORDER
                </p>
                <h3 className="font-display text-lg leading-[1.125rem] min-[1400px]:text-[1.4375rem] min-[1400px]:leading-[1.5625rem]">
                  PERSONALISED PRODUCTS
                </h3>
                <p className="text-[0.6875rem] leading-4 text-muted-foreground min-[1400px]:text-sm min-[1400px]:leading-[1.375rem]">
                  Custom clothing, photo-led gifts and made-to-order pieces.
                </p>
              </div>
              <span className="text-[0.6875rem] leading-3.5 font-extrabold group-hover:text-primary min-[1400px]:text-[0.8125rem] min-[1400px]:leading-4">
                Explore Services ↗
              </span>
            </div>
          </Link>

          <Link
            href="/services#print-event-materials"
            className="group flex min-h-[22.5rem] flex-col gap-4 rounded-md border border-border bg-card p-4 focus-visible:ring-3 focus-visible:ring-ring min-[1400px]:absolute min-[1400px]:top-[29.25rem] min-[1400px]:left-[36.375rem] min-[1400px]:h-[18.5rem] min-[1400px]:min-h-0 min-[1400px]:w-[38.75rem] min-[1400px]:flex-row min-[1400px]:items-center min-[1400px]:gap-6 min-[1400px]:p-6"
          >
            <MediaImage
              loading="eager"
              src="/home-print-event-materials.jpg"
              alt="Printed event materials and award plaques"
              sizes="(min-width: 1024px) 254px, 220px"
              fit="contain"
              className="aspect-[16/9] w-full shrink-0 rounded-sm border border-border min-[1400px]:w-[15.875rem]"
            />
            <div className="flex flex-1 flex-col gap-3">
              <p className="text-[0.6875rem] leading-3.5 font-extrabold tracking-label text-info">
                MADE TO ORDER
              </p>
              <h3 className="font-display text-[1.875rem] leading-8">
                PRINT &amp; EVENT MATERIALS
              </h3>
              <p className="text-sm leading-[1.375rem] text-muted-foreground">
                Invitations, programmes, business print and award plaques.
              </p>
              <span className="text-[0.8125rem] leading-4 font-extrabold group-hover:text-primary">
                Explore Services ↗
              </span>
            </div>
          </Link>

          <Link
            href="/services#branding-signage"
            className="group flex min-h-[7.25rem] items-center gap-3 rounded-sm border border-border bg-accent p-3 focus-visible:ring-3 focus-visible:ring-ring min-[1400px]:absolute min-[1400px]:top-[35.375rem] min-[1400px]:left-[3.875rem] min-[1400px]:h-[13.75rem] min-[1400px]:w-[31.875rem] min-[1400px]:-rotate-[2.4deg] min-[1400px]:gap-7 min-[1400px]:p-6"
          >
            <MediaImage
              loading="eager"
              src="/debby-art-prints-logo.jpg"
              alt="Debby Art & Prints branding example"
              sizes="134px"
              fit="contain"
              className="h-14 w-24 shrink-0 rounded-xs border border-border bg-card min-[1400px]:h-[4.875rem] min-[1400px]:w-[8.375rem]"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5 min-[1400px]:gap-2.5">
              <p className="text-[0.5625rem] leading-3 font-extrabold tracking-label min-[1400px]:text-[0.6875rem] min-[1400px]:leading-3.5">
                BRANDING &amp; SIGNAGE
              </p>
              <h3 className="font-display text-lg leading-[1.125rem] min-[1400px]:text-[1.875rem] min-[1400px]:leading-8">
                BRANDING &amp; SIGNAGE
              </h3>
              <p className="hidden text-sm leading-[1.375rem] min-[1400px]:block">
                Brand identity, screen printing, signage and creative painting.
              </p>
              <span className="text-[0.6875rem] leading-3.5 font-extrabold group-hover:text-primary min-[1400px]:text-[0.8125rem] min-[1400px]:leading-4">
                Explore Services ↗
              </span>
            </div>
          </Link>
        </Reveal>
      </Container>
    </section>
  )
}

export { OfferRoutes }
