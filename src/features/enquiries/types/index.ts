import type {
  DesignReadiness,
  EnquiryStatus,
  FulfilmentMethod,
  RequestKind,
} from "@/db/generated/prisma/enums"

type RequestKindValue = "ARTWORK" | "SERVICE"
import type {
  RequestArtworkOption,
  RequestServiceOption,
} from "@/types/request-catalogue"

type RequestItem =
  | { kind: "ARTWORK"; record: RequestArtworkOption }
  | { kind: "SERVICE"; record: RequestServiceOption }

type RequestContextMode = "default" | "art-commission" | "artwork" | "service"
type RequestStep = "interest" | "item" | "details" | "delivery" | "contact"

type RequestSearchParams = Record<string, string | string[] | undefined>

type RequestPageData = {
  artworks: RequestArtworkOption[]
  initialContext: {
    itemSlug: string | null
    kind: RequestKindValue | null
    mode: RequestContextMode
  }
  services: RequestServiceOption[]
  status: "ready"
}

type InvalidRequestPageData = {
  message: string
  status: "invalid"
}

type RequestDraft = {
  broadRequest: boolean
  colour: string
  contextMode: RequestContextMode
  customerName: string
  customerNote: string
  designReadiness: string
  email: string
  finish: string
  framing: string
  fulfilmentMethod: string
  itemSlug: string
  location: string
  material: string
  phoneWhatsApp: string
  preferredDate: string
  quantity: string
  requestKind: RequestKindValue | ""
  sizeFormat: string
}

type RequestField = keyof RequestDraft
type RequestFieldErrors = Partial<Record<RequestField, string>>

type EnquiryActionState =
  | { status: "idle" }
  | {
      fieldErrors: RequestFieldErrors
      message: string
      status: "validation"
    }
  | {
      message: string
      status: "context-error"
    }
  | {
      message: string
      status: "error"
    }
  | {
      duplicate: boolean
      reference: string
      status: "success"
    whatsappUrl: string
  }

type RequestAuthority =
  | {
      id: string
      kind: "ARTWORK"
      name: string
      record: RequestArtworkOption
      slug: string
    }
  | {
      id: string
      kind: "SERVICE"
      name: string
      record: RequestServiceOption
      slug: string
    }
  | {
      id: null
      kind: RequestKindValue
      name: string
      record: null
      slug: string
    }

type NormalizedEnquiryInput = {
  artworkId: string | null
  colour: string | null
  customerName: string
  customerNote: string | null
  designReadiness: DesignReadiness | null
  email: string | null
  finish: string | null
  framing: string | null
  fulfilmentMethod: FulfilmentMethod
  itemNameSnapshot: string
  itemSlugSnapshot: string
  location: string | null
  material: string | null
  phoneWhatsApp: string
  preferredDate: Date | null
  quantity: number | null
  requestKind: RequestKind
  serviceId: string | null
  sizeFormat: string | null
}

type EnquiryPersistenceInput = NormalizedEnquiryInput & {
  reference: string
  whatsappSummary: string
}

type EnquiryListFilters = {
  kind?: RequestKind
  page: number
  search?: string
  status?: EnquiryStatus
}

type EnquiryListSearchParams = {
  kind?: string
  page?: string
  q?: string
  status?: string
}

type EnquiryStatusTone = "new" | "contacted" | "resolved"

type EnquiryListItem = {
  customerName: string
  id: string
  itemName: string
  phoneWhatsApp: string
  receivedLabel: string
  reference: string
  requestKind: RequestKind
  requestKindLabel: string
  status: EnquiryStatus
  statusTone: EnquiryStatusTone
}

type EnquiryListResult = {
  items: EnquiryListItem[]
  newToday: number
  total: number
  totalPages: number
}

export type {
  EnquiryActionState,
  EnquiryPersistenceInput,
  EnquiryListFilters,
  EnquiryListItem,
  EnquiryListResult,
  EnquiryListSearchParams,
  EnquiryStatusTone,
  InvalidRequestPageData,
  RequestArtworkOption,
  RequestContextMode,
  RequestDraft,
  RequestField,
  RequestFieldErrors,
  RequestItem,
  RequestKindValue,
  RequestPageData,
  RequestAuthority,
  RequestServiceOption,
  RequestSearchParams,
  RequestStep,
  NormalizedEnquiryInput,
}
