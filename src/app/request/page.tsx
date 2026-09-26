import type { Metadata } from "next"

import { PublicShell } from "@/components/shared/public/public-shell"
import {
  RequestFeaturePage,
  loadRequestPage,
  type RequestSearchParams,
} from "@/features/enquiries"
import { createPageMetadata } from "../site-metadata"

type RequestRouteProps = {
  searchParams: Promise<RequestSearchParams>
}

const REQUEST_DESCRIPTION =
  "Submit a structured artwork or service request, then continue the saved enquiry on WhatsApp."

export async function generateMetadata({
  searchParams,
}: RequestRouteProps): Promise<Metadata> {
  const data = await loadRequestPage(await searchParams)

  if (data.status === "invalid") {
    return createPageMetadata({
      title: "Make a Request",
      description: REQUEST_DESCRIPTION,
      path: "/request",
    })
  }

  if (data.initialContext.mode === "artwork") {
    const artwork = data.artworks.find(
      (item) => item.slug === data.initialContext.itemSlug
    )

    if (artwork) {
      return createPageMetadata({
        title: `Request ${artwork.title}`,
        description: `Start a guided request for ${artwork.title} by Debby Art & Prints, then continue the saved enquiry on WhatsApp.`,
        path: `/request?artwork=${encodeURIComponent(artwork.slug)}`,
        image: artwork.imageSrc
          ? { url: artwork.imageSrc, alt: artwork.imageAlt }
          : null,
      })
    }
  }

  if (data.initialContext.mode === "service") {
    const service = data.services.find(
      (item) => item.slug === data.initialContext.itemSlug
    )

    if (service) {
      return createPageMetadata({
        title: `Request ${service.name}`,
        description: `Start a guided request for ${service.name} from Debby Art & Prints, then continue the saved enquiry on WhatsApp.`,
        path: `/request?service=${encodeURIComponent(service.slug)}`,
        image: service.imageSrc
          ? { url: service.imageSrc, alt: service.imageAlt }
          : null,
      })
    }
  }

  if (data.initialContext.mode === "art-commission") {
    return createPageMetadata({
      title: "Request an Art Commission",
      description:
        "Start a guided art commission request with Debby Art & Prints, then continue the saved enquiry on WhatsApp.",
      path: "/request?type=art-commission",
    })
  }

  return createPageMetadata({
    title: "Make a Request",
    description: REQUEST_DESCRIPTION,
    path: "/request",
  })
}

export default function RequestRoute({ searchParams }: RequestRouteProps) {
  return (
    <PublicShell activePath="/request">
      <RequestFeaturePage searchParams={searchParams} />
    </PublicShell>
  )
}
