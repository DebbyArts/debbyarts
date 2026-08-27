import { ServiceGroup } from "@/db/generated/prisma/enums"
import type { ServiceGroup as ServiceGroupValue } from "@/db/generated/prisma/enums"
import type { ServiceActionState } from "@/features/services/types"

const SERVICE_GROUP_DEFINITIONS = [
  { value: ServiceGroup.PERSONALISED_PRODUCTS, label: "Personalised Products", anchorId: "personalised-products" },
  { value: ServiceGroup.PRINT_EVENT_MATERIALS, label: "Print & Event Materials", anchorId: "print-event-materials" },
  { value: ServiceGroup.BRANDING_SIGNAGE, label: "Branding & Signage", anchorId: "branding-signage" },
] as const

const SERVICE_GROUP_ORDER: Record<ServiceGroupValue, number> = {
  [ServiceGroup.PERSONALISED_PRODUCTS]: 0,
  [ServiceGroup.PRINT_EVENT_MATERIALS]: 1,
  [ServiceGroup.BRANDING_SIGNAGE]: 2,
}
const SERVICE_GROUP_LABELS: Record<ServiceGroupValue, string> = {
  [ServiceGroup.PERSONALISED_PRODUCTS]: "Personalised products",
  [ServiceGroup.PRINT_EVENT_MATERIALS]: "Print & event materials",
  [ServiceGroup.BRANDING_SIGNAGE]: "Branding & signage",
}

const NGN_FORMATTER = new Intl.NumberFormat("en-NG", {
  style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 2,
})

const SERVICE_REVALIDATION_PATHS = [
  "/admin/services",
  "/services",
  "/request",
] as const
const INITIAL_SERVICE_ACTION_STATE: ServiceActionState = {
  message: "",
  status: "idle",
}
const SERVICE_ADMIN_SELECT_CLASS =
  "h-12 w-full rounded-sm border border-input bg-card px-4 text-base focus-visible:border-info focus-visible:ring-[3px] focus-visible:ring-ring/70"
const SERVICE_REQUEST_OPTION_QUESTIONS = [
  ["askQuantity", "Ask for Quantity?", "Customer enters one positive number."],
  [
    "askDesignReadiness",
    "Ask about Design Readiness?",
    "Uses the fixed public choices: finished design, needs help, or not sure.",
  ],
  ["askColour", "Ask for Colour?", "Collects the customer’s colour preference."],
  ["askMaterial", "Ask for Material?", "Collects the customer’s material preference."],
  ["askFinish", "Ask for Finish?", "Collects the customer’s finish preference."],
] as const

const REQUEST_PREPARATION_DETAILS = [
  "Size / format",
  "Quantity",
  "Wording / design reference",
  "Colour / finish",
  "Deadline / event date",
  "Delivery / pickup need",
] as const

export {
  INITIAL_SERVICE_ACTION_STATE,
  NGN_FORMATTER,
  REQUEST_PREPARATION_DETAILS,
  SERVICE_ADMIN_SELECT_CLASS,
  SERVICE_GROUP_DEFINITIONS,
  SERVICE_GROUP_LABELS,
  SERVICE_GROUP_ORDER,
  SERVICE_REQUEST_OPTION_QUESTIONS,
  SERVICE_REVALIDATION_PATHS,
}
