import "server-only"

import { connection } from "next/server"

import {
  mapToRequestServiceOption,
  mapToServiceAdminListItem,
  mapToServiceEditorValue,
  mapToServiceOptionsValue,
  projectServiceGroups,
} from "@/features/services/mappers/service.mapper"
import {
  findAdminServices,
  findPublishedRequestService,
  findPublishedRequestServices,
  findPublishedServices,
  findServiceForEditor,
  findServiceForOptions,
} from "@/features/services/repositories/service.repository"
import type { ServiceAdminListFilters } from "@/features/services/types"

async function getPublishedServiceGroups() {
  await connection()
  const services = await findPublishedServices()

  return projectServiceGroups(services)
}

async function getPublishedRequestServices() {
  await connection()
  return (await findPublishedRequestServices()).map(mapToRequestServiceOption)
}

async function getPublishedRequestService(slug: string) {
  const service = await findPublishedRequestService(slug)
  return service ? mapToRequestServiceOption(service) : null
}

async function getAdminServices(filters: ServiceAdminListFilters) {
  await connection()
  return (await findAdminServices(filters)).map(mapToServiceAdminListItem)
}

async function getServiceEditor(id: string) {
  await connection()
  const service = await findServiceForEditor(id)
  return service ? mapToServiceEditorValue(service) : null
}

async function getServiceOptions(id: string) {
  await connection()
  const service = await findServiceForOptions(id)
  return service ? mapToServiceOptionsValue(service) : null
}

export {
  getAdminServices,
  getPublishedRequestService,
  getPublishedRequestServices,
  getPublishedServiceGroups,
  getServiceEditor,
  getServiceOptions,
}
