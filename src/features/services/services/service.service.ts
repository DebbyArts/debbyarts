import "server-only"

import { connection } from "next/server"

import { mapToRequestServiceOption } from "@/features/services/mappers/request-service.mapper"
import {
  mapToServiceAdminListItem,
  mapToServiceEditorValue,
  mapToServiceOptionsValue,
  projectServiceGroups,
} from "@/features/services/mappers/service.mapper"
import {
  createService,
  deleteService,
  findAdminServices,
  findPublishedRequestService,
  findPublishedRequestServices,
  findPublishedServices,
  findServiceById,
  findServiceForEditor,
  findServiceForOptions,
  findServiceImagePath,
  updateService,
} from "@/features/services/repositories/service.repository"
import type {
  ServiceAdminListFilters,
  ServiceMutationInput,
  ServiceRequestOptionsInput,
} from "@/features/services/types"
import type { VerifiedAdmin } from "@/server/auth/authorize"
import {
  deleteCatalogueImage,
  uploadCatalogueImage,
} from "@/server/storage/image-storage"

type ServiceSaveInput = {
  admin: VerifiedAdmin
  data: ServiceMutationInput
  existing: NonNullable<Awaited<ReturnType<typeof findServiceById>>> | null
  file: File | null
  removeImage: boolean
}

type ServiceSaveResult =
  | { status: "saved"; warning?: string }
  | { status: "not-saved"; warning: string }

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

async function getServiceForSave(id: string) {
  return findServiceById(id)
}

async function saveService({
  admin,
  data,
  existing,
  file,
  removeImage,
}: ServiceSaveInput): Promise<ServiceSaveResult> {
  const uploaded = file
    ? await uploadCatalogueImage(admin, "service", file)
    : null
  const imageData = uploaded
    ? {
        primaryImageHeight: uploaded.height,
        primaryImagePath: uploaded.path,
        primaryImageWidth: uploaded.width,
      }
    : removeImage
      ? {
          primaryImageHeight: null,
          primaryImagePath: null,
          primaryImageWidth: null,
        }
      : {}

  try {
    if (existing) {
      await updateService(existing.id, { ...data, ...imageData })
    } else {
      await createService({ ...data, ...imageData })
    }
  } catch (error) {
    if (uploaded) {
      try {
        await deleteCatalogueImage(admin, "service", uploaded.path)
      } catch {
        return {
          status: "not-saved",
          warning:
            "The database save failed and the new image needs manual Storage cleanup.",
        }
      }
    }
    throw error
  }

  const oldPath = existing?.primaryImagePath
  if (oldPath && (uploaded || removeImage)) {
    try {
      await deleteCatalogueImage(admin, "service", oldPath)
    } catch (error) {
      return {
        status: "saved",
        warning:
          error instanceof Error
            ? error.message
            : "Service saved, but the old image needs Storage cleanup.",
      }
    }
  }

  return { status: "saved" }
}

async function saveServiceOptions(
  serviceId: string,
  data: ServiceRequestOptionsInput
) {
  return updateService(serviceId, data)
}

async function unpublishService(serviceId: string) {
  return updateService(serviceId, { published: false })
}

async function removeService(admin: VerifiedAdmin, serviceId: string) {
  const service = await findServiceImagePath(serviceId)
  if (!service) return null

  await deleteService(serviceId)

  if (!service.primaryImagePath) return { cleanupPath: null }

  try {
    await deleteCatalogueImage(admin, "service", service.primaryImagePath)
    return { cleanupPath: null }
  } catch {
    return { cleanupPath: service.primaryImagePath }
  }
}

export {
  getAdminServices,
  getPublishedRequestService,
  getPublishedRequestServices,
  getPublishedServiceGroups,
  getServiceEditor,
  getServiceForSave,
  getServiceOptions,
  removeService,
  saveService,
  saveServiceOptions,
  unpublishService,
}
