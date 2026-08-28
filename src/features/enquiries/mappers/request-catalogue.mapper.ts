import type { Prisma } from "@/db/generated/prisma/client"
import type {
  RequestArtworkOption,
  RequestServiceOption,
} from "@/features/enquiries/types"
import {
  REQUEST_ARTWORK_SELECT,
  REQUEST_SERVICE_SELECT,
} from "@/features/enquiries/repositories/request-catalogue.repository"
import { resolvePublicStorageObjectUrl } from "@/shared/storage/public-url"

const REQUEST_ARTWORK_CATEGORY_LABELS = {
  PAINTING: "Painting",
  PENCIL_PORTRAIT: "Pencil Portrait",
  FRAMED_CUSTOM_ARTWORK: "Framed Artwork",
  DIGITAL_ARTWORK: "Digital Artwork",
} as const

const REQUEST_SERVICE_GROUP_LABELS = {
  PERSONALISED_PRODUCTS: "Personalised Products",
  PRINT_EVENT_MATERIALS: "Print & Event Materials",
  BRANDING_SIGNAGE: "Branding & Signage",
} as const

type RequestArtworkRecord = Prisma.ArtworkGetPayload<{
  select: typeof REQUEST_ARTWORK_SELECT
}>
type RequestServiceRecord = Prisma.ServiceGetPayload<{
  select: typeof REQUEST_SERVICE_SELECT
}>

function mapToRequestArtworkOption(
  artwork: RequestArtworkRecord
): RequestArtworkOption {
  return {
    id: artwork.id,
    slug: artwork.slug,
    title: artwork.title,
    categoryLabel: REQUEST_ARTWORK_CATEGORY_LABELS[artwork.category],
    imageSrc: resolvePublicStorageObjectUrl(artwork.primaryImagePath),
    imageAlt:
      artwork.primaryImageAlt?.trim() ||
      `${artwork.title}, an artwork by Debby Art & Prints`,
    availableSizes: artwork.availableSizes,
    framingEnabled: artwork.framingEnabled,
    framingOptions: artwork.framingOptions,
    askQuantity: artwork.askQuantity,
  }
}

function mapToRequestServiceOption(
  service: RequestServiceRecord
): RequestServiceOption {
  const imageSrc = resolvePublicStorageObjectUrl(service.primaryImagePath)
  const imageAlt = service.primaryImageAlt?.trim()

  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    groupLabel: REQUEST_SERVICE_GROUP_LABELS[service.group],
    imageSrc: imageSrc && imageAlt ? imageSrc : null,
    imageAlt:
      imageSrc && imageAlt ? imageAlt : `Image unavailable for ${service.name}`,
    askQuantity: service.askQuantity,
    askSizeFormat: service.askSizeFormat,
    sizeFormatOptions: service.sizeFormatOptions,
    askDesignReadiness: service.askDesignReadiness,
    askColour: service.askColour,
    askMaterial: service.askMaterial,
    materialOptions: service.materialOptions,
    askFinish: service.askFinish,
  }
}

export {
  mapToRequestArtworkOption,
  mapToRequestServiceOption,
  type RequestArtworkRecord,
  type RequestServiceRecord,
}
