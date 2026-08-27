import type {
  ArtworkCategory,
  AvailabilityStatus,
  PricingMode,
} from "@/db/generated/prisma/enums"
import type { ALL_ARTWORK } from "@/features/artwork/constants"

type ArtworkFilter = ArtworkCategory | typeof ALL_ARTWORK

type ArtworkProjection = {
  availability: AvailabilityStatus
  availabilityLabel: string
  category: ArtworkCategory
  categoryItemLabel: string
  categoryLabel: string
  description: string
  displayedPieceDimensions: string | null
  gallery: ArtworkGalleryImage[]
  imageAlt: string
  imageHeight: number | null
  imageSrc: string | null
  imageWidth: number | null
  mediumFormat: string | null
  priceAmount: string | null
  priceLabel: string
  pricingMode: PricingMode
  requestHref: string
  slug: string
  title: string
}

type ArtworkGalleryImage = {
  alt: string
  height: number | null
  id: string
  src: string | null
  width: number | null
}

type ArtworkAdminListFilters = {
  category?: ArtworkCategory
  published?: boolean
  search?: string
}

type ArtworkListSearchParams = {
  category?: string
  cleanup?: string
  deleted?: string
  q?: string
  status?: string
}

type ArtworkAdminListItem = {
  availability: AvailabilityStatus
  category: ArtworkCategory
  displayOrder: number
  featured: boolean
  id: string
  imageUrl: string | null
  primaryImageAlt: string | null
  published: boolean
  title: string
}

type ArtworkEditorValue = {
  additionalImages: ArtworkAdditionalImage[]
  availability: AvailabilityStatus
  category: ArtworkCategory
  description: string
  displayedPieceDimensions: string | null
  displayOrder: number
  featured: boolean
  id: string
  imageUrl: string | null
  mediumFormat: string | null
  priceAmount: string | null
  pricingMode: PricingMode
  primaryImageAlt: string | null
  primaryImagePath: string | null
  published: boolean
  title: string
}

type ArtworkAdditionalImage = {
  altText: string | null
  height: number
  id: string
  imageUrl: string | null
  storagePath: string
  width: number
}

type ArtworkImageActionState = {
  message: string
  status: "idle" | "success" | "error" | "warning"
}

type ArtworkOptionsValue = {
  askQuantity: boolean
  availableSizes: string[]
  framingEnabled: boolean
  framingOptions: string[]
  id: string
  title: string
}

type ArtworkActionState = {
  createdId?: string | null
  message: string
  status: "idle" | "success" | "error" | "warning"
}

type ArtworkMutationInput = {
  availability: AvailabilityStatus
  category: ArtworkCategory
  description: string
  displayedPieceDimensions: string | null
  displayOrder: number
  featured: boolean
  mediumFormat: string | null
  priceAmount: string | null
  pricingMode: PricingMode
  primaryImageAlt: string | null
  published: boolean
  slug: string
  title: string
}

type ArtworkRequestOptionsInput = {
  askQuantity: boolean
  availableSizes: string[]
  framingEnabled: boolean
  framingOptions: string[]
}

export type {
  ArtworkActionState,
  ArtworkAdditionalImage,
  ArtworkAdminListFilters,
  ArtworkAdminListItem,
  ArtworkCategory,
  AvailabilityStatus as ArtworkAvailability,
  ArtworkEditorValue,
  ArtworkFilter,
  ArtworkGalleryImage,
  ArtworkImageActionState,
  ArtworkListSearchParams,
  ArtworkMutationInput,
  ArtworkOptionsValue,
  ArtworkProjection,
  ArtworkRequestOptionsInput,
  PricingMode as ArtworkPricingMode,
}
