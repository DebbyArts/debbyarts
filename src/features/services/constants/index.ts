import { ServiceGroup } from "@/db/generated/prisma/enums"
import type { ServiceGroup as ServiceGroupValue } from "@/db/generated/prisma/enums"

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

const NGN_FORMATTER = new Intl.NumberFormat("en-NG", {
  style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 2,
})

export { NGN_FORMATTER, SERVICE_GROUP_DEFINITIONS, SERVICE_GROUP_ORDER }
