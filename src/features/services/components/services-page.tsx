import Link from "next/link"

import { Container } from "@/components/shared/container"
import { EmptyState } from "@/components/shared/empty-state"
import { MediaImage } from "@/components/shared/media-image"
import { Button } from "@/components/ui/button"
import type {
  ServiceGroupPresentation,
  ServicePresentation,
} from "@/features/services/service-catalogue"
import { cn } from "@/lib/utils"

const REQUEST_PREPARATION_DETAILS = [
  "Size / format",
  "Quantity",
  "Wording / design reference",
  "Colour / finish",
  "Deadline / event date",
  "Delivery / pickup need",
] as const

type ServicesPageProps = {
  groups: ServiceGroupPresentation[]
}

type ServiceCardProps = {
  emphasized: boolean
  imageOnRight: boolean
  service: ServicePresentation
}

function ServiceImageFallback({ service }: { service: ServicePresentation }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className="h-2 w-14 bg-info" />
      <span className="text-[0.6875rem] leading-4 font-extrabold tracking-label text-foreground">
        IMAGE UNAVAILABLE
      </span>
      <span className="max-w-44 text-xs leading-[1.125rem] text-muted-foreground">
        {service.groupLabel}
      </span>
    </div>
  )
}

function ServiceCard({
  emphasized,
  imageOnRight,
  service,
}: ServiceCardProps) {
  return (
    <article
      className={cn(
        "grid gap-5 border-b-2 border-border py-8 lg:grid-cols-[minmax(18rem,23.75rem)_minmax(0,1fr)] lg:gap-10 lg:py-11",
        emphasized && "bg-muted px-5 lg:px-7",
        imageOnRight &&
          "lg:grid-cols-[minmax(0,1fr)_minmax(18rem,26.875rem)]"
      )}
    >
      <MediaImage
        alt={service.imageAlt}
        src={service.imageSrc}
        sizes="(min-width: 1024px) 430px, calc(100vw - 40px)"
        unoptimized={service.imageSrc?.startsWith("https://")}
        fallback={<ServiceImageFallback service={service} />}
        className={cn(
          "h-[15.625rem] border-2 border-border bg-card lg:h-[18.75rem]",
          emphasized && "h-[12.5rem]",
          service.imageSrc && "h-[13.125rem]",
          imageOnRight && "lg:order-2"
        )}
      />
      <div
        className={cn(
          "flex min-w-0 flex-col justify-between gap-7 py-1 lg:py-2.5",
          imageOnRight && "lg:order-1"
        )}
      >
        <div className="flex flex-col gap-3">
          <p className="text-[0.625rem] leading-4 font-extrabold tracking-label text-primary lg:text-[0.6875rem]">
            {service.groupLabel.toUpperCase()}
          </p>
          <h3 className="font-display text-[1.9375rem] leading-[2.0625rem] tracking-[-0.04em] lg:text-[2.75rem] lg:leading-[2.875rem]">
            {service.name.toUpperCase()}
          </h3>
          <p className="text-base leading-6 font-extrabold text-foreground">
            {service.pricing.label}
          </p>
          <p className="max-w-[42.5rem] text-sm leading-[1.375rem] text-muted-foreground lg:text-base lg:leading-body">
            {service.description}
          </p>
          {service.optionCues.length > 0 ? (
            <ul
              aria-label={`${service.name} request details`}
              className="flex flex-wrap gap-2 pt-1"
            >
              {service.optionCues.map((cue) => (
                <li
                  key={cue}
                  className="border border-border bg-background px-3 py-2 text-xs leading-[1.125rem]"
                >
                  {cue}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <Link
          href={service.requestHref}
          className="flex min-h-11 w-fit items-center text-sm leading-5 font-extrabold underline decoration-2 underline-offset-4 transition-colors hover:text-primary"
        >
          Request this service ↗
        </Link>
      </div>
    </article>
  )
}

function ServiceGroupSection({
  group,
  groupIndex,
}: {
  group: ServiceGroupPresentation
  groupIndex: number
}) {
  const headingId = `${group.anchorId}-heading`

  return (
    <section
      id={group.anchorId}
      aria-labelledby={headingId}
      className="scroll-mt-24"
    >
      <h2 id={headingId} className="sr-only">
        {group.label}
      </h2>
      <div>
        {group.services.map((service, serviceIndex) => (
          <ServiceCard
            key={service.id}
            service={service}
            imageOnRight={(groupIndex + serviceIndex) % 2 === 1}
            emphasized={(groupIndex + serviceIndex) % 3 === 1}
          />
        ))}
      </div>
    </section>
  )
}

function ServicesHero() {
  return (
    <section
      aria-labelledby="services-heading"
      className="relative border-b-2 border-border"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-2 bg-primary lg:w-[1.125rem]"
      />
      <Container className="flex flex-col gap-6 py-14 pl-8 lg:flex-row lg:items-end lg:justify-between lg:py-24 lg:pl-20">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3.5">
            <span aria-hidden="true" className="h-2 w-11 bg-info lg:w-[3.625rem]" />
            <p className="text-[0.6875rem] leading-4 font-extrabold tracking-label lg:text-xs">
              PRINT · PERSONALISE · BRAND
            </p>
          </div>
          <h1 id="services-heading" className="type-display">
            SERVICES
          </h1>
        </div>
        <div className="flex max-w-[26.875rem] flex-col gap-4 lg:gap-5">
          <p className="text-[1.0625rem] leading-[1.625rem] lg:text-xl lg:leading-body-lg">
            Printed and custom-production work, organised by what you need.
          </p>
          <Link
            href="/art"
            className="flex min-h-11 w-fit items-center text-[0.8125rem] leading-5 font-bold underline decoration-2 underline-offset-4 hover:text-primary lg:text-sm"
          >
            Looking for artwork? Browse Art &amp; Gallery ↗
          </Link>
        </div>
      </Container>
    </section>
  )
}

function ServiceGroupNavigation({
  groups,
}: {
  groups: ServiceGroupPresentation[]
}) {
  if (groups.length === 0) return null

  return (
    <nav aria-label="Service groups" className="border-b-2 border-border bg-card">
      <Container
        className={cn(
          "grid gap-0 py-5 md:py-0",
          groups.length === 1 && "md:grid-cols-1",
          groups.length === 2 && "md:grid-cols-2",
          groups.length === 3 && "md:grid-cols-3"
        )}
      >
        {groups.map((group) => (
          <Link
            key={group.value}
            href={`#${group.anchorId}`}
            className="flex min-h-13 items-center border border-b-0 border-border px-4 py-3.5 text-[0.8125rem] leading-5 font-bold transition-colors first:bg-info hover:bg-info md:min-h-16 md:border-b-0 md:border-l-0 md:px-[1.125rem] md:py-[1.375rem] md:text-[0.9375rem] md:last:border-r-0"
          >
            {group.number} · {group.label}
          </Link>
        ))}
      </Container>
    </nav>
  )
}

function ServicesCatalogue({ groups }: ServicesPageProps) {
  return (
    <section aria-labelledby="services-catalogue-heading">
      <Container className="py-12 lg:py-20">
        <div className="flex flex-col gap-2 border-b-2 border-border pb-6 sm:flex-row sm:items-end sm:justify-between lg:pb-9">
          <div className="flex flex-col gap-2.5">
            <p className="text-[0.625rem] leading-4 font-extrabold tracking-label text-primary lg:text-xs">
              PERSONALISED · PRINT · BRANDING
            </p>
            <h2 id="services-catalogue-heading" className="type-h2">
              SELECT A SERVICE
            </h2>
          </div>
          <p className="max-w-sm text-xs leading-[1.1875rem] text-muted-foreground sm:text-right lg:text-[0.8125rem] lg:leading-5">
            Published pricing appears below. Final request details are confirmed with you.
          </p>
        </div>

        {groups.length > 0 ? (
          groups.map((group, index) => (
            <ServiceGroupSection
              key={group.value}
              group={group}
              groupIndex={index}
            />
          ))
        ) : (
          <EmptyState
            className="my-10 min-h-72 bg-card"
            visual="01"
            title="Services are being prepared"
            description="There are no published services to show yet. You can still start a general request and describe what you need."
            action={
              <Button asChild size="sm" className="mt-2">
                <Link href="/request">Make a Request ↗</Link>
              </Button>
            }
          />
        )}
      </Container>
    </section>
  )
}

function BeforeYouRequest() {
  return (
    <section
      aria-labelledby="before-request-heading"
      className="border-y-2 border-border bg-muted"
    >
      <Container className="grid gap-8 py-12 lg:grid-cols-[26.25rem_minmax(0,1fr)] lg:gap-[4.5rem] lg:py-20">
        <div className="flex flex-col items-start gap-[1.125rem]">
          <p className="text-[0.625rem] leading-4 font-extrabold tracking-label text-primary lg:text-xs">
            BEFORE YOU REQUEST
          </p>
          <h2 id="before-request-heading" className="type-h2">
            A FEW USEFUL DETAILS.
          </h2>
          <p className="text-sm leading-6 text-muted-foreground lg:text-[0.9375rem]">
            These details help us understand your request faster. Share only what
            is relevant to the service you need.
          </p>
          <Button asChild>
            <Link href="/request">Make a Request ↗</Link>
          </Button>
        </div>
        <ol className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
          {REQUEST_PREPARATION_DETAILS.map((detail, index) => (
            <li
              key={detail}
              className="flex min-h-16 items-center border border-border bg-background p-3.5 text-xs leading-[1.125rem] font-bold sm:p-5 lg:min-h-[4.125rem] lg:p-[1.375rem] lg:text-[0.9375rem] lg:leading-[1.375rem]"
            >
              <span className="hidden sm:inline">
                {String(index + 1).padStart(2, "0")} ·&nbsp;
              </span>
              {detail}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}

function FinalServicesCallToAction() {
  return (
    <section aria-labelledby="services-final-cta" className="border-b-2 border-border bg-accent">
      <Container className="flex flex-col items-start gap-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:py-[4.25rem]">
        <h2
          id="services-final-cta"
          className="max-w-[51.25rem] font-display text-[2.375rem] leading-[2.4375rem] tracking-[-0.04em] lg:text-[3.5rem] lg:leading-[3.5rem]"
        >
          KNOW THE SERVICE YOU NEED?
        </h2>
        <Button asChild variant="secondary" size="lg">
          <Link href="/request">Make a Request ↗</Link>
        </Button>
      </Container>
    </section>
  )
}

function ServicesPage({ groups }: ServicesPageProps) {
  return (
    <>
      <ServicesHero />
      <ServiceGroupNavigation groups={groups} />
      <ServicesCatalogue groups={groups} />
      <BeforeYouRequest />
      <FinalServicesCallToAction />
    </>
  )
}

export { ServicesPage, type ServicesPageProps }
