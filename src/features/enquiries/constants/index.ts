import { DesignReadiness } from "@/db/generated/prisma/enums"
import type {
  EnquiryActionState,
  RequestDraft,
  RequestStep,
} from "@/features/enquiries/types"

const DESIGN_READINESS_OPTIONS = [
  {
    value: DesignReadiness.FINISHED_DESIGN,
    label: "I have a finished design",
  },
  {
    value: DesignReadiness.NEEDS_DESIGN_HELP,
    label: "I need design help",
  },
  {
    value: DesignReadiness.NOT_SURE,
    label: "I'm not sure",
  },
] as const

const DESIGN_READINESS_VALUES = Object.values(DesignReadiness)

const INITIAL_ENQUIRY_ACTION_STATE: EnquiryActionState = { status: "idle" }

const EMPTY_REQUEST_DETAIL_DRAFT: Pick<
  RequestDraft,
  | "colour"
  | "designReadiness"
  | "finish"
  | "framing"
  | "material"
  | "quantity"
  | "sizeFormat"
> = {
  quantity: "",
  sizeFormat: "",
  framing: "",
  designReadiness: "",
  colour: "",
  material: "",
  finish: "",
}

const REQUEST_STEP_LABELS: Record<RequestStep, string> = {
  interest: "Interest",
  item: "Specific item",
  details: "Request details",
  delivery: "Delivery & timing",
  contact: "Contact",
}

const REQUEST_STEP_TITLES: Record<RequestStep, string> = {
  interest: "WHAT ARE YOU INTERESTED IN?",
  item: "WHICH ITEM DO YOU NEED?",
  details: "TELL US THE USEFUL DETAILS",
  delivery: "WHERE AND WHEN?",
  contact: "HOW SHOULD WE REACH YOU?",
}

const DEFAULT_REQUEST_STEPS: readonly RequestStep[] = [
  "interest",
  "item",
  "details",
  "delivery",
  "contact",
]

const CONTEXTUAL_REQUEST_STEPS: readonly RequestStep[] = [
  "details",
  "delivery",
  "contact",
]

const REQUEST_CONTEXT_MODES = [
  "default",
  "art-commission",
  "artwork",
  "service",
] as const

const REQUEST_STAGE_VARIANTS = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 18 }),
  centre: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -14 }),
}

const COMPACT_PROGRESS_VARIANTS = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 8 }),
  centre: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -6 }),
}

const ENQUIRIES_PAGE_SIZE = 20

const ENQUIRY_STATUS_TONES = {
  NEW: "new",
  CONTACTED: "contacted",
  RESOLVED: "resolved",
} as const

const REQUEST_KIND_LABELS = {
  ARTWORK: "Artwork",
  SERVICE: "Service",
} as const

export {
  COMPACT_PROGRESS_VARIANTS,
  CONTEXTUAL_REQUEST_STEPS,
  DEFAULT_REQUEST_STEPS,
  DESIGN_READINESS_OPTIONS,
  DESIGN_READINESS_VALUES,
  ENQUIRIES_PAGE_SIZE,
  ENQUIRY_STATUS_TONES,
  EMPTY_REQUEST_DETAIL_DRAFT,
  INITIAL_ENQUIRY_ACTION_STATE,
  REQUEST_STAGE_VARIANTS,
  REQUEST_CONTEXT_MODES,
  REQUEST_KIND_LABELS,
  REQUEST_STEP_LABELS,
  REQUEST_STEP_TITLES,
}
