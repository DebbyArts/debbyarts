import Link from "next/link"
import * as motion from "motion/react-client"

import { Container } from "@/components/ui/container"
import { MediaImage } from "@/components/ui/media-image"
import { Reveal } from "@/components/shared/motion/reveal"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "./Eyebrow"

function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-2 bg-info min-[1400px]:w-[1.125rem]"
      />
      <Container className="grid min-h-[57.5rem] gap-14 py-16 pl-8 sm:grid-cols-2 sm:items-center sm:gap-8 min-[1400px]:min-h-[52.75rem] min-[1400px]:grid-cols-[minmax(0,43.125rem)_minmax(0,1fr)] min-[1400px]:gap-0 min-[1400px]:py-[4.75rem] min-[1400px]:pl-[5.125rem] min-[1400px]:pr-16">
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
            <div className="flex flex-col gap-3 md:flex-row md:gap-4">
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

export { Hero }
