import type { Prisma } from "@/db/generated/prisma/client"
import { PricingMode } from "@/db/generated/prisma/enums"
import {
  SERVICE_GROUP_DEFINITIONS,
  SERVICE_GROUP_ORDER,
} from "@/features/services/constants"
import type {
  ServiceAdminListItem,
  ServiceEditorValue,
  ServiceGroupPresentation,
  ServiceOptionsValue,
  ServicePresentation,
  ServicePricingPresentation,
} from "@/features/services/types"
import {
  ADMIN_SERVICE_LIST_SELECT,
  type PublishedServiceRecord,
  REQUEST_SERVICE_SELECT,
  SERVICE_EDITOR_SELECT,
  SERVICE_OPTIONS_SELECT,
} from "@/features/services/repositories/service.repository"
import type { RequestServiceOption } from "@/shared/types/request-catalogue"
import { resolvePublicStorageObjectUrl } from "@/shared/utils/storage"
import { formatNgn } from "@/shared/utils/format-ngn"

type AdminServiceListRecord = Prisma.ServiceGetPayload<{
  select: typeof ADMIN_SERVICE_LIST_SELECT
}>
type ServiceEditorRecord = Prisma.ServiceGetPayload<{
  select: typeof SERVICE_EDITOR_SELECT
}>
type ServiceOptionsRecord = Prisma.ServiceGetPayload<{
  select: typeof SERVICE_OPTIONS_SELECT
}>
type RequestServiceRecord = Prisma.ServiceGetPayload<{
  select: typeof REQUEST_SERVICE_SELECT
}>

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

  const formattedAmount = formatNgn(amount)

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

function projectService(
  service: PublishedServiceRecord
): ServicePresentation {
  const groupDefinition = SERVICE_GROUP_DEFINITIONS.find(
    (group) => group.value === service.group
  )

  if (!groupDefinition) {
    throw new Error(`Service "${service.slug}" has an unsupported group.`)
  }

  const imageSrc = resolvePublicStorageObjectUrl(service.primaryImagePath)
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

function mapToServiceAdminListItem(
  service: AdminServiceListRecord
): ServiceAdminListItem {
  return {
    displayOrder: service.displayOrder,
    group: service.group,
    id: service.id,
    imageUrl: resolvePublicStorageObjectUrl(service.primaryImagePath),
    name: service.name,
    primaryImageAlt: service.primaryImageAlt,
    published: service.published,
  }
}

function mapToServiceEditorValue(
  service: ServiceEditorRecord
): ServiceEditorValue {
  return {
    description: service.description,
    displayOrder: service.displayOrder,
    group: service.group,
    id: service.id,
    imageUrl: resolvePublicStorageObjectUrl(service.primaryImagePath),
    name: service.name,
    priceAmount: service.priceAmount?.toString() ?? null,
    pricingMode: service.pricingMode,
    primaryImageAlt: service.primaryImageAlt,
    primaryImagePath: service.primaryImagePath,
    published: service.published,
  }
}

function mapToServiceOptionsValue(
  service: ServiceOptionsRecord
): ServiceOptionsValue {
  return service
}

function mapToRequestServiceOption(
  service: RequestServiceRecord
): RequestServiceOption {
  const group = SERVICE_GROUP_DEFINITIONS.find(
    (definition) => definition.value === service.group
  )

  if (!group) {
    throw new Error(`Service "${service.slug}" has an unsupported group.`)
  }

  const imageSrc = resolvePublicStorageObjectUrl(service.primaryImagePath)
  const imageAlt = service.primaryImageAlt?.trim()

  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    groupLabel: group.label,
    imageSrc: imageSrc && imageAlt ? imageSrc : null,
    imageAlt:
      imageSrc && imageAlt
        ? imageAlt
        : `Image unavailable for ${service.name}`,
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
  deriveOptionCues,
  derivePricingPresentation,
  getServiceRequestHref,
  mapToRequestServiceOption,
  mapToServiceAdminListItem,
  mapToServiceEditorValue,
  mapToServiceOptionsValue,
  projectServiceGroups,
  type RequestServiceRecord,
}
