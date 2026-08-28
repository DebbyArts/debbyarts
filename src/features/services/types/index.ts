import type { PricingMode, ServiceGroup } from "@/db/generated/prisma/enums"

type ServicePricingPresentation = { label: string; mode: PricingMode }
type ServicePresentation = {
  description: string; group: ServiceGroup; groupLabel: string; id: string
  imageAlt: string; imageSrc?: string; name: string; optionCues: string[]
  pricing: ServicePricingPresentation; requestHref: string; slug: string
}
type ServiceGroupPresentation = {
  anchorId: string; label: string; number: string; services: ServicePresentation[]; value: ServiceGroup
}
type ServiceActionState = {
  createdId?: string | null
  message: string
  status: "idle" | "success" | "error" | "warning"
}

type ServiceAdminListFilters = {
  group?: ServiceGroup
  published?: boolean
  search?: string
}

type ServiceListSearchParams = {
  cleanup?: string
  deleted?: string
  group?: string
  q?: string
  status?: string
}

type ServiceAdminListItem = {
  displayOrder: number
  group: ServiceGroup
  id: string
  imageUrl: string | null
  name: string
  primaryImageAlt: string | null
  published: boolean
}

type ServiceEditorValue = {
  description: string
  displayOrder: number
  group: ServiceGroup
  id: string
  imageUrl: string | null
  name: string
  priceAmount: string | null
  pricingMode: PricingMode
  primaryImageAlt: string | null
  primaryImagePath: string | null
  published: boolean
}

type ServiceOptionsValue = {
  askColour: boolean
  askDesignReadiness: boolean
  askFinish: boolean
  askMaterial: boolean
  askQuantity: boolean
  askSizeFormat: boolean
  id: string
  materialOptions: string[]
  name: string
  sizeFormatOptions: string[]
}

type ServiceMutationInput = {
  description: string
  displayOrder: number
  group: ServiceGroup
  name: string
  priceAmount: string | null
  pricingMode: PricingMode
  primaryImageAlt: string | null
  published: boolean
  slug: string
}

type ServiceRequestOptionsInput = {
  askColour: boolean
  askDesignReadiness: boolean
  askFinish: boolean
  askMaterial: boolean
  askQuantity: boolean
  askSizeFormat: boolean
  materialOptions: string[]
  sizeFormatOptions: string[]
}

export type {
  ServiceActionState,
  ServiceAdminListFilters,
  ServiceAdminListItem,
  ServiceEditorValue,
  ServiceGroupPresentation,
  ServiceListSearchParams,
  ServiceMutationInput,
  ServiceOptionsValue,
  ServicePresentation,
  ServicePricingPresentation,
  ServiceRequestOptionsInput,
}
