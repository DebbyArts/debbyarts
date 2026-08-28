import "server-only"

import { connection } from "next/server"

import { ENQUIRIES_PAGE_SIZE } from "@/features/enquiries/constants"
import {
  mapToRequestArtworkOption,
  mapToRequestServiceOption,
} from "@/features/enquiries/mappers/request-catalogue.mapper"
import {
  mapToEnquiryDetail,
  mapToEnquiryListItem,
} from "@/features/enquiries/mappers/enquiry.mapper"
import {
  findEnquiryDetail,
  findEnquiryList,
  findPublishedRequestArtworks,
  findPublishedRequestServices,
} from "@/features/enquiries/repositories/enquiry.query.repository"
import type {
  EnquiryListFilters,
  EnquiryListResult,
  LoadRequestPageResult,
  RequestSearchParams,
} from "@/features/enquiries/types"
import { parseRequestContext } from "@/features/enquiries/utils/request-context.utils"

async function getPublishedRequestCatalogue() {
  await connection()
  const [artworks, services] = await Promise.all([
    findPublishedRequestArtworks(),
    findPublishedRequestServices(),
  ])

  return {
    artworks: artworks.map(mapToRequestArtworkOption),
    services: services.map(mapToRequestServiceOption),
  }
}

async function getEnquiryList(
  filters: EnquiryListFilters
): Promise<EnquiryListResult> {
  const { enquiries, total, newToday } = await findEnquiryList(filters)

  return {
    items: enquiries.map(mapToEnquiryListItem),
    total,
    newToday,
    totalPages: Math.max(1, Math.ceil(total / ENQUIRIES_PAGE_SIZE)),
  }
}

async function getEnquiryDetail(id: string) {
  const enquiry = await findEnquiryDetail(id)
  return enquiry ? mapToEnquiryDetail(enquiry) : null
}

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

export { getEnquiryDetail, getEnquiryList, loadRequestPage }
