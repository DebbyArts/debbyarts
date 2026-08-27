import type { Prisma } from "@/db/generated/prisma/client"
import type { RequestServiceOption } from "@/types/request-catalogue"
import { SERVICE_GROUP_DEFINITIONS } from "@/features/services/constants"
import { resolveImageSource } from "@/features/services/mappers/service.mapper"
import { REQUEST_SERVICE_SELECT } from "@/features/services/repositories/service.repository"

type RequestServiceRecord = Prisma.ServiceGetPayload<{
  select: typeof REQUEST_SERVICE_SELECT
}>

function mapToRequestServiceOption(
  service: RequestServiceRecord
): RequestServiceOption {
  const group = SERVICE_GROUP_DEFINITIONS.find(
    (definition) => definition.value === service.group
  )

  if (!group) {
    throw new Error(`Service "${service.slug}" has an unsupported group.`)
  }

  const imageSrc = resolveImageSource(
    service.primaryImagePath,
    process.env.PUBLIC_MEDIA_BASE_URL
  )
  const imageAlt = service.primaryImageAlt?.trim()

  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    groupLabel: group.label,
    imageSrc: imageSrc && imageAlt ? imageSrc : null,
    imageAlt: imageSrc && imageAlt ? imageAlt : `Image unavailable for ${service.name}`,
    askQuantity: service.askQuantity,
    askSizeFormat: service.askSizeFormat,
    sizeFormatOptions: service.sizeFormatOptions,
    askDesignReadiness: service.askDesignReadiness,
    askColour: service.askColour,
    askMaterial: service.askMaterial,
    askFinish: service.askFinish,
  }
}

export { mapToRequestServiceOption, type RequestServiceRecord }
