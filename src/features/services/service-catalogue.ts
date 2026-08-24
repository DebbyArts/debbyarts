import {
  PricingMode,
  ServiceGroup,
  type PricingMode as PricingModeValue,
  type ServiceGroup as ServiceGroupValue,
} from "@/db/generated/prisma/enums"
import type { PublishedServiceRecord } from "@/features/services/service-query"

const SERVICE_GROUP_DEFINITIONS = [
  {
    value: ServiceGroup.PERSONALISED_PRODUCTS,
    label: "Personalised Products",
    anchorId: "personalised-products",
  },
  {
    value: ServiceGroup.PRINT_EVENT_MATERIALS,
    label: "Print & Event Materials",
    anchorId: "print-event-materials",
  },
  {
    value: ServiceGroup.BRANDING_SIGNAGE,
    label: "Branding & Signage",
    anchorId: "branding-signage",
  },
] as const

const SERVICE_GROUP_ORDER: Record<ServiceGroupValue, number> = {
  [ServiceGroup.PERSONALISED_PRODUCTS]: 0,
  [ServiceGroup.PRINT_EVENT_MATERIALS]: 1,
  [ServiceGroup.BRANDING_SIGNAGE]: 2,
}

type ServicePricingPresentation = {
  label: string
  mode: PricingModeValue
}

type ServicePresentation = {
  description: string
  group: ServiceGroupValue
  groupLabel: string
  id: string
  imageAlt: string
  imageSrc?: string
  name: string
  optionCues: string[]
  pricing: ServicePricingPresentation
  requestHref: string
  slug: string
}

type ServiceGroupPresentation = {
  anchorId: string
  label: string
  number: string
  services: ServicePresentation[]
  value: ServiceGroupValue
}

const NGN_FORMATTER = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

function invalidPricingError(service: PublishedServiceRecord) {
  return new Error(
    `Service "${service.slug}" has invalid persisted pricing data.`
  )
}

function derivePricingPresentation(
  service: PublishedServiceRecord
): ServicePricingPresentation {
  if (service.pricingMode === PricingMode.NONE) {
    if (service.priceAmount !== null) {
      throw invalidPricingError(service)
    }

    return {
      mode: PricingMode.NONE,
      label: "Price on request",
    }
  }

  if (service.priceAmount === null) {
    throw invalidPricingError(service)
  }

  const amount = service.priceAmount.toNumber()

  if (!Number.isFinite(amount) || amount <= 0) {
    throw invalidPricingError(service)
  }

  const formattedAmount = NGN_FORMATTER.format(amount)

  if (service.pricingMode === PricingMode.EXACT) {
    return {
      mode: PricingMode.EXACT,
      label: formattedAmount,
    }
  }

  if (service.pricingMode === PricingMode.STARTING_FROM) {
    return {
      mode: PricingMode.STARTING_FROM,
      label: `From ${formattedAmount}`,
    }
  }

  throw invalidPricingError(service)
}

function deriveOptionCues(service: PublishedServiceRecord) {
  const cues: string[] = []

  if (service.askQuantity) cues.push("Quantity")
  if (service.askSizeFormat) cues.push("Size / format")
  if (service.askDesignReadiness) cues.push("Design readiness")
  if (service.askColour) cues.push("Colour")
  if (service.askMaterial) cues.push("Material")
  if (service.askFinish) cues.push("Finish")

  return cues
}

function resolveImageSource(path: string | null) {
  const value = path?.trim()

  if (!value) return undefined
  if (value.startsWith("/")) return value

  try {
    const url = new URL(value)
    return url.protocol === "https:" ? url.toString() : undefined
  } catch {
    return undefined
  }
}

function getServiceRequestHref(slug: string) {
  return `/request?service=${encodeURIComponent(slug)}`
}

function compareServices(
  left: PublishedServiceRecord,
  right: PublishedServiceRecord
) {
  const groupDifference =
    SERVICE_GROUP_ORDER[left.group] - SERVICE_GROUP_ORDER[right.group]

  if (groupDifference !== 0) return groupDifference
  if (left.displayOrder !== right.displayOrder) {
    return left.displayOrder - right.displayOrder
  }

  const nameDifference = left.name.localeCompare(right.name, "en", {
    sensitivity: "base",
  })

  if (nameDifference !== 0) return nameDifference
  return left.slug.localeCompare(right.slug, "en")
}

function projectService(service: PublishedServiceRecord): ServicePresentation {
  const groupDefinition = SERVICE_GROUP_DEFINITIONS.find(
    (group) => group.value === service.group
  )

  if (!groupDefinition) {
    throw new Error(`Service "${service.slug}" has an unsupported group.`)
  }

  const imageSrc = resolveImageSource(service.primaryImagePath)
  const imageAlt = service.primaryImageAlt?.trim()
  const usableImageSrc = imageSrc && imageAlt ? imageSrc : undefined
  const usableImageAlt = usableImageSrc ? imageAlt : undefined

  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    description: service.description,
    group: service.group,
    groupLabel: groupDefinition.label,
    imageSrc: usableImageSrc,
    imageAlt: usableImageAlt
      ? usableImageAlt
      : `Image unavailable for ${service.name}`,
    pricing: derivePricingPresentation(service),
    optionCues: deriveOptionCues(service),
    requestHref: getServiceRequestHref(service.slug),
  }
}

function projectServiceGroups(
  services: readonly PublishedServiceRecord[]
): ServiceGroupPresentation[] {
  const orderedServices = [...services].sort(compareServices)

  return SERVICE_GROUP_DEFINITIONS.map((group, index) => ({
    value: group.value,
    label: group.label,
    anchorId: group.anchorId,
    number: String(index + 1).padStart(2, "0"),
    services: orderedServices
      .filter((service) => service.group === group.value)
      .map(projectService),
  })).filter((group) => group.services.length > 0)
}

export {
  SERVICE_GROUP_DEFINITIONS,
  deriveOptionCues,
  derivePricingPresentation,
  getServiceRequestHref,
  projectServiceGroups,
  resolveImageSource,
  type ServiceGroupPresentation,
  type ServicePresentation,
  type ServicePricingPresentation,
}
