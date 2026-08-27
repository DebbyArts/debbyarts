import type { PricingMode, ServiceGroup } from "@/db/generated/prisma/enums"
import type { PublishedServiceRecord } from "@/features/services/repositories/service.repository"

type ServicePricingPresentation = { label: string; mode: PricingMode }
type ServicePresentation = {
  description: string; group: ServiceGroup; groupLabel: string; id: string
  imageAlt: string; imageSrc?: string; name: string; optionCues: string[]
  pricing: ServicePricingPresentation; requestHref: string; slug: string
}
type ServiceGroupPresentation = {
  anchorId: string; label: string; number: string; services: ServicePresentation[]; value: ServiceGroup
}
type ServiceProjectionOptions = { publicMediaBaseUrl?: string }

export type {
  PublishedServiceRecord,
  ServiceGroupPresentation,
  ServicePresentation,
  ServicePricingPresentation,
  ServiceProjectionOptions,
}
