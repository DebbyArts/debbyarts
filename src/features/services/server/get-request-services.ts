import "server-only"

import { connection } from "next/server"

import type { Prisma } from "@/db/generated/prisma/client"
import type { RequestServiceOption } from "@/features/enquiries/request-types"
import {
  SERVICE_GROUP_DEFINITIONS,
  resolveImageSource,
} from "@/features/services/service-catalogue"

const REQUEST_SERVICE_SELECT = {
  id: true,
  slug: true,
  name: true,
  group: true,
  primaryImagePath: true,
  primaryImageAlt: true,
  askQuantity: true,
  askSizeFormat: true,
  sizeFormatOptions: true,
  askDesignReadiness: true,
  askColour: true,
  askMaterial: true,
  askFinish: true,
} satisfies Prisma.ServiceSelect

type RequestServiceRecord = Prisma.ServiceGetPayload<{
  select: typeof REQUEST_SERVICE_SELECT
}>

function projectRequestService(
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

async function getPublishedRequestServices() {
  await connection()

  const { prisma } = await import("@/db/client")
  const services = await prisma.service.findMany({
    where: { published: true },
    select: REQUEST_SERVICE_SELECT,
    orderBy: [
      { displayOrder: "asc" },
      { name: "asc" },
      { slug: "asc" },
    ],
  })

  return services.map(projectRequestService)
}

async function getPublishedRequestService(slug: string) {
  const { prisma } = await import("@/db/client")
  const service = await prisma.service.findFirst({
    where: { slug, published: true },
    select: REQUEST_SERVICE_SELECT,
  })

  return service ? projectRequestService(service) : null
}

export {
  REQUEST_SERVICE_SELECT,
  getPublishedRequestService,
  getPublishedRequestServices,
  projectRequestService,
  type RequestServiceRecord,
}
