import "server-only"

import { connection } from "next/server"

import { mapToRequestServiceOption } from "@/features/services/mappers/request-service.mapper"
import { projectServiceGroups } from "@/features/services/mappers/service.mapper"
import {
  findPublishedRequestService,
  findPublishedRequestServices,
  findPublishedServices,
} from "@/features/services/repositories/service.repository"

async function getPublishedServiceGroups() {
  await connection()
  const services = await findPublishedServices()

  return projectServiceGroups(services, {
    publicMediaBaseUrl: process.env.PUBLIC_MEDIA_BASE_URL,
  })
}

async function getPublishedRequestServices() {
  await connection()
  return (await findPublishedRequestServices()).map(mapToRequestServiceOption)
}

async function getPublishedRequestService(slug: string) {
  const service = await findPublishedRequestService(slug)
  return service ? mapToRequestServiceOption(service) : null
}

export {
  getPublishedRequestService,
  getPublishedRequestServices,
  getPublishedServiceGroups,
}
