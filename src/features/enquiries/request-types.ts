type RequestKindValue = "ARTWORK" | "SERVICE"

type RequestArtworkOption = {
  askQuantity: boolean
  availableSizes: string[]
  categoryLabel: string
  framingEnabled: boolean
  framingOptions: string[]
  id: string
  imageAlt: string
  imageSrc: string | null
  slug: string
  title: string
}

type RequestServiceOption = {
  askColour: boolean
  askDesignReadiness: boolean
  askFinish: boolean
  askMaterial: boolean
  askQuantity: boolean
  askSizeFormat: boolean
  groupLabel: string
  id: string
  imageAlt: string
  imageSrc: string | null
  name: string
  sizeFormatOptions: string[]
  slug: string
}

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
