import Link from "next/link"

import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { HomeMagneticCta } from "./HomeMagneticCta"
import { Eyebrow } from "./Eyebrow"

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

export { FinalRequestCta }
