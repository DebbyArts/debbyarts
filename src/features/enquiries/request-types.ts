type RequestKindValue = "ARTWORK" | "SERVICE"
import type {
  RequestArtworkOption,
  RequestServiceOption,
} from "@/types/request-catalogue"

type RequestItem =
  | { kind: "ARTWORK"; record: RequestArtworkOption }
  | { kind: "SERVICE"; record: RequestServiceOption }

type RequestContextMode = "default" | "art-commission" | "artwork" | "service"

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

export type {
  EnquiryActionState,
  InvalidRequestPageData,
  RequestArtworkOption,
  RequestContextMode,
  RequestDraft,
  RequestField,
  RequestFieldErrors,
  RequestItem,
  RequestKindValue,
  RequestPageData,
  RequestServiceOption,
}
