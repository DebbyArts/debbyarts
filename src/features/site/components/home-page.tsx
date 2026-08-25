import Link from "next/link"
import * as motion from "motion/react-client"

import { Container } from "@/components/shared/container"
import { MediaImage } from "@/components/shared/media-image"
import { Reveal } from "@/components/shared/motion/reveal"
import { Button } from "@/components/ui/button"
import type {
  FeaturedArtworkResult,
  HomeArtwork,
} from "@/features/site/server/get-featured-artwork"
import { cn } from "@/lib/utils"
import { HomeMagneticCta } from "@/features/site/components/home-magnetic-cta"

type HomePageProps = {
  featuredArtwork: FeaturedArtworkResult
}

const artworkCategoryLabels = {
  PAINTING: "Painting",
  PENCIL_PORTRAIT: "Pencil portrait",
  FRAMED_CUSTOM_ARTWORK: "Framed artwork",
  DIGITAL_ARTWORK: "Digital artwork",
} as const

const requestSteps = [
  ["Explore the relevant artwork or service.", "EXPLORE"],
  ["Choose the artwork or service you’re interested in.", "CHOOSE"],
  ["Add the few details Debby Art & Prints needs.", "ADD DETAILS"],
  ["Submit your request, then continue the conversation on WhatsApp.", "SUBMIT"],
] as const

const essentials = [
  {
    eyebrow: "SERVICE AREA",
    title: "LAGOS + NATIONWIDE",
    description:
      "Debby Art & Prints serves customers across Lagos and nationwide.",
  },
  {
    eyebrow: "ORDERING",
    title: "DETAILS CONFIRMED WITH YOU",
    description: "Production details are confirmed for each request.",
  },
  {
    eyebrow: "DELIVERY / PICKUP",
    title: "CONFIRMED PER REQUEST",
    description:
      "Final delivery or pickup details are discussed for the specific request.",
  },
] as const

function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 w-fit items-center rounded-pill border border-border px-3.5 text-[0.6875rem] leading-3.5 font-extrabold tracking-label",
        className
      )}
    >
      {children}
    </span>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-2 bg-info min-[1400px]:w-[1.125rem]"
      />
      <Container className="grid min-h-[57.5rem] gap-14 py-16 pl-8 min-[1400px]:min-h-[52.75rem] min-[1400px]:grid-cols-[minmax(0,43.125rem)_minmax(0,1fr)] min-[1400px]:items-center min-[1400px]:gap-0 min-[1400px]:py-[4.75rem] min-[1400px]:pl-[5.125rem] min-[1400px]:pr-16">
        <div className="flex max-w-[43.125rem] flex-col gap-[1.875rem]">
          <Reveal>
            <Eyebrow className="bg-accent text-accent-foreground">
              ART + PRINT + BRAND + PERSONALISE
            </Eyebrow>
          </Reveal>
          <div className="flex flex-col gap-1.5">
            <Reveal delay={0.06}>
              <p className="text-[0.75rem] leading-4 font-extrabold tracking-label text-primary min-[1400px]:text-[0.9375rem] min-[1400px]:leading-5">
                DEBBY ART &amp; PRINTS
              </p>
            </Reveal>
            <div className="overflow-hidden">
              <motion.h1
                className="type-display"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                MAKE IT PERSONAL.
              </motion.h1>
            </div>
          </div>
          <Reveal delay={0.16}>
            <p className="max-w-copy text-base leading-[1.625rem] text-muted-foreground min-[1400px]:text-xl min-[1400px]:leading-[1.875rem]">
              Art, printing, branding and personalised creative work for
              individuals, businesses and events across Lagos and nationwide.
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button asChild variant="secondary" size="lg">
                <Link href="/art">Browse Art &amp; Gallery ↗</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.28}>
            <div className="flex items-center gap-3 text-[0.6875rem] leading-3.5 font-extrabold tracking-label">
              <span aria-hidden="true" className="h-0.5 w-12 bg-info" />
              <span>ART · PRINT · BRANDING · PERSONALISATION</span>
            </div>
          </Reveal>
        </div>

        <div className="relative mx-auto h-[29.625rem] w-full max-w-[21.375rem] min-[1400px]:h-[43.125rem] min-[1400px]:max-w-[33.75rem]">
          <motion.span
            aria-hidden="true"
            className="absolute top-[1.875rem] bottom-0 left-0 w-[calc(100%-2.5rem)] rounded-[1.125rem] border border-border bg-info min-[1400px]:top-[2.375rem] min-[1400px]:w-[30.875rem]"
            initial={{ opacity: 0, x: -16, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ type: "spring", visualDuration: 0.35, bounce: 0.12, delay: 0.12 }}
          />
          <motion.span
            aria-hidden="true"
            className="absolute top-2 right-0 bottom-6 w-[calc(100%-2.5rem)] rounded-[1.125rem] border border-border bg-primary min-[1400px]:top-2.5 min-[1400px]:bottom-12 min-[1400px]:w-[30.875rem]"
            initial={{ opacity: 0, x: 16, y: -8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ type: "spring", visualDuration: 0.35, bounce: 0.12, delay: 0.16 }}
          />
          <motion.div
            className="absolute top-0 left-5 h-[25.375rem] w-[calc(100%-2.5rem)] min-[1400px]:left-[1.375rem] min-[1400px]:h-[40rem] min-[1400px]:w-[30rem]"
            initial={{ opacity: 0, scale: 1.035, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            <MediaImage
              priority
              src="/home-eagle.jpg"
              alt="Bald eagle painting by Debby Art & Prints"
              sizes="(min-width: 1024px) 480px, 302px"
              className="h-full w-full rounded-[0.875rem] border border-border bg-card"
            />
          </motion.div>
          <span className="absolute bottom-2 left-9 inline-flex min-h-[1.875rem] items-center rounded-pill border border-border bg-accent px-3 text-[0.5625rem] leading-3 font-extrabold tracking-label min-[1400px]:bottom-1 min-[1400px]:left-10 min-[1400px]:min-h-[2.375rem] min-[1400px]:px-4 min-[1400px]:text-[0.6875rem] min-[1400px]:leading-3.5">
            EAGLE · ORIGINAL ARTWORK
          </span>
        </div>
      </Container>
    </section>
  )
}

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
          <div className="mt-14 grid gap-12 sm:grid-cols-2 desktop:grid-cols-[minmax(0,20.375rem)_minmax(0,25.875rem)_minmax(0,18.75rem)] desktop:items-start desktop:justify-between">
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

        <Reveal className="mt-11 flex flex-col gap-5 border-y border-border bg-muted p-5 min-[1400px]:relative min-[1400px]:h-[53.75rem] min-[1400px]:block min-[1400px]:p-0">
          <Link
            href="/art"
            className="group flex items-end gap-4 rounded-md focus-visible:ring-3 focus-visible:ring-ring min-[1400px]:absolute min-[1400px]:top-[3.875rem] min-[1400px]:left-10 min-[1400px]:h-[24.375rem] min-[1400px]:w-[45rem] min-[1400px]:gap-[1.875rem]"
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

function RequestProcess() {
  return (
    <section aria-labelledby="request-process-heading" className="relative overflow-hidden bg-foreground text-white">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-2 bg-info min-[1400px]:w-[1.125rem]"
      />
      <Container className="flex flex-col gap-12 py-20 pr-8 min-[1400px]:min-h-[56.25rem] min-[1400px]:flex-row min-[1400px]:gap-[4.875rem] min-[1400px]:px-[4.5rem] min-[1400px]:py-[7rem]">
        <div className="flex flex-col justify-between gap-12 min-[1400px]:w-[26.875rem]">
          <div className="flex flex-col gap-6">
            <Eyebrow className="border-white bg-accent text-accent-foreground">
              A SIMPLE REQUEST PROCESS
            </Eyebrow>
            <h2 id="request-process-heading" className="type-h2">
              HOW
              <br /> REQUESTS
              <br /> WORK
            </h2>
            <p className="max-w-[22.5rem] text-[1.0625rem] leading-[1.6875rem] text-border-subtle">
              Choose what you’re interested in, share a few useful details and
              submit your request.
            </p>
          </div>
          <div className="hidden flex-col gap-4 min-[1400px]:flex">
            <Button asChild size="lg" className="w-fit border-white">
              <Link href="/request">Make a Request ↗</Link>
            </Button>
            <p className="text-[0.6875rem] leading-3.5 font-extrabold tracking-label text-accent">
              START WHEN YOU’RE READY
            </p>
          </div>
        </div>

        <motion.ol
          className="flex flex-1 flex-col min-[1400px]:pt-[1.375rem]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
        >
          {requestSteps.map(([description, action], index) => (
            <motion.li
              key={action}
              className={cn(
                "flex min-h-36 items-center gap-5 border-t border-muted-foreground py-6 min-[1400px]:min-h-[9.25rem] min-[1400px]:gap-6",
                index % 2 === 1 && "min-[1400px]:pl-10",
                index === requestSteps.length - 1 && "border-b"
              )}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-pill border border-white font-display text-lg leading-6 min-[1400px]:size-16 min-[1400px]:text-2xl min-[1400px]:leading-[1.875rem]",
                  index === 0 && "bg-info text-info-foreground",
                  index === 1 && "bg-primary",
                  index === 2 && "bg-accent text-foreground",
                  index === 3 && "bg-white text-foreground"
                )}
                initial={{ scale: 0.82 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", visualDuration: 0.35, bounce: 0.12, delay: index * 0.09 }}
              >
                {String(index + 1).padStart(2, "0")}
              </motion.span>
              <p className="flex-1 text-base leading-6 font-bold min-[1400px]:text-[1.375rem] min-[1400px]:leading-[1.875rem]">
                {description}
              </p>
              <span className="hidden w-[9.375rem] shrink-0 text-[0.6875rem] leading-[0.9375rem] font-extrabold tracking-label text-accent sm:block">
                {action}
              </span>
            </motion.li>
          ))}
        </motion.ol>

        <Button asChild size="lg" className="border-white min-[1400px]:hidden">
          <Link href="/request">Make a Request ↗</Link>
        </Button>
      </Container>
    </section>
  )
}

function OrderingEssentials() {
  return (
    <section aria-labelledby="ordering-heading" className="relative bg-background">
      <span aria-hidden="true" className="absolute top-0 right-0 h-3.5 w-[9.375rem] bg-info" />
      <Container className="flex flex-col gap-12 py-20 min-[1400px]:min-h-[45rem] min-[1400px]:flex-row min-[1400px]:items-center min-[1400px]:gap-[4.5rem] min-[1400px]:px-[4.25rem] min-[1400px]:py-24">
        <motion.div
          className="flex min-h-[16.25rem] flex-col justify-between rounded-sm border border-border bg-primary p-8 text-white min-[1400px]:h-[31.25rem] min-[1400px]:w-[25.625rem] min-[1400px]:shrink-0 min-[1400px]:p-[2.125rem]"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="flex flex-col gap-[1.375rem]">
            <Eyebrow className="bg-accent text-accent-foreground">GOOD TO KNOW</Eyebrow>
            <h2 id="ordering-heading" className="type-h2">
              ORDERING +
              <br /> DELIVERY
            </h2>
          </div>
          <div className="mt-12 flex flex-col gap-3">
            <span aria-hidden="true" className="h-2 w-21 bg-accent" />
            <p>A few helpful details before you make a request.</p>
          </div>
        </motion.div>

        <ol className="flex flex-1 flex-col">
          {essentials.map((item, index) => (
            <motion.li
              key={item.title}
              className={cn(
                "flex min-h-[9.75rem] items-center gap-5 border-t border-border py-[1.125rem]",
                index === essentials.length - 1 && "border-b"
              )}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.span
                className={cn(
                  "flex size-14 shrink-0 items-center justify-center rounded-pill border border-border font-display text-lg min-[1400px]:size-[4.5rem] min-[1400px]:text-[1.375rem]",
                  index === 0 && "bg-info",
                  index === 1 && "bg-accent",
                  index === 2 && "bg-card"
                )}
                initial={{ scale: 0.85 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", visualDuration: 0.35, bounce: 0.12, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                {String(index + 1).padStart(2, "0")}
              </motion.span>
              <div className="flex min-w-0 flex-col gap-2">
                <p className="text-[0.6875rem] leading-3.5 font-extrabold tracking-label text-primary">
                  {item.eyebrow}
                </p>
                <h3 className="font-display text-2xl leading-7 min-[1400px]:text-[1.875rem] min-[1400px]:leading-[2.125rem]">
                  {item.title}
                </h3>
                <p className="text-[0.9375rem] leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </Container>
    </section>
  )
}

function FinalRequestCta() {
  return (
    <section aria-labelledby="final-request-heading" className="relative overflow-hidden bg-card">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-2 bg-info min-[1400px]:w-[1.125rem]"
      />
      <Container className="flex min-h-[43.125rem] flex-col justify-between gap-14 py-20 pl-8 min-[1400px]:min-h-[38.75rem] min-[1400px]:flex-row min-[1400px]:items-center min-[1400px]:px-[4.5rem] min-[1400px]:py-24">
        <div className="flex max-w-[51.25rem] flex-col gap-[1.625rem]">
          <Eyebrow className="bg-accent text-accent-foreground">READY WHEN YOU ARE</Eyebrow>
          <h2 id="final-request-heading" className="type-h2">
            ARTWORK. PRINT.
            <br /> PERSONAL. CUSTOM.
          </h2>
          <p className="max-w-[40.625rem] text-lg leading-[1.8125rem] text-muted-foreground">
            Start a guided request for an artwork, personalised item, printing,
            branding or something custom.
          </p>
          <Button asChild size="lg" className="w-fit">
            <Link href="/request">Make a Request ↗</Link>
          </Button>
        </div>

        <HomeMagneticCta />
      </Container>
    </section>
  )
}

function HomePage({ featuredArtwork }: HomePageProps) {
  return (
    <>
      <Hero />
      <FeaturedArtwork result={featuredArtwork} />
      <OfferRoutes />
      <RequestProcess />
      <OrderingEssentials />
      <FinalRequestCta />
    </>
  )
}

export { HomePage, type HomePageProps }
