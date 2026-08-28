import "server-only"

import { connection } from "next/server"

import {
  mapToServiceAdminListItem,
  mapToServiceEditorValue,
  mapToServiceOptionsValue,
  projectServiceGroups,
} from "@/features/services/mappers/service.mapper"
import {
  findAdminServices,
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
  getPublishedServiceGroups,
  getServiceEditor,
  getServiceOptions,
}
