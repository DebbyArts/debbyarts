import "server-only"

import { parseRequestContext } from "@/features/enquiries/utils/request-context.utils"
import type {
  InvalidRequestPageData,
  RequestPageData,
  RequestSearchParams,
} from "@/features/enquiries/types"
import { getPublishedRequestCatalogue } from "@/shared/request-catalogue"

type LoadRequestPageResult = RequestPageData | InvalidRequestPageData

async function loadRequestPage(
  searchParams: RequestSearchParams
): Promise<LoadRequestPageResult> {
  const parsed = parseRequestContext({
    artwork: searchParams.artwork,
    service: searchParams.service,
    type: searchParams.type,
  })

  if (parsed.status === "invalid") {
    return parsed
  }

  const { artworks, services } = await getPublishedRequestCatalogue()

  if (parsed.mode === "artwork") {
    const artwork = artworks.find((candidate) => candidate.slug === parsed.slug)

    if (!artwork) {
      return {
        status: "invalid",
        message:
          "That artwork is no longer available for requests. Choose another artwork or start a general request.",
      }
    }

    return {
      status: "ready",
      artworks,
      services,
      initialContext: {
        mode: "artwork",
        kind: "ARTWORK",
        itemSlug: artwork.slug,
      },
    }
  }

  if (parsed.mode === "service") {
    const service = services.find((candidate) => candidate.slug === parsed.slug)

    if (!service) {
      return {
        status: "invalid",
        message:
          "That service is no longer available for requests. Choose another service or start a general request.",
      }
    }

    return {
      status: "ready",
      artworks,
      services,
      initialContext: {
        mode: "service",
        kind: "SERVICE",
        itemSlug: service.slug,
      },
    }
  }

  if (parsed.mode === "art-commission") {
    return {
      status: "ready",
      artworks,
      services,
      initialContext: {
        mode: "art-commission",
        kind: "ARTWORK",
        itemSlug: null,
      },
    }
  }

  return {
    status: "ready",
    artworks,
    services,
    initialContext: {
      mode: "default",
      kind: null,
      itemSlug: null,
    },
  }
}

export { loadRequestPage, type LoadRequestPageResult }
