import "server-only"

import {
  createService,
  deleteService,
  findServiceById,
  findServiceImagePath,
  updateService,
} from "@/features/services/repositories/service.repository"
import type {
  ServiceMutationInput,
  ServiceRequestOptionsInput,
} from "@/features/services/types"
import type { VerifiedAdmin } from "@/shared/auth/authorize"
import {
  deleteCatalogueImage,
  uploadCatalogueImage,
} from "@/shared/storage/image-storage"

type ServiceSaveInput = {
  admin: VerifiedAdmin
  data: ServiceMutationInput
  existing: NonNullable<Awaited<ReturnType<typeof findServiceById>>> | null
  file: File | null
  removeImage: boolean
}

type ServiceSaveResult =
  | { createdId?: string; status: "saved"; warning?: string }
  | { createdId?: never; status: "not-saved"; warning: string }

async function getServiceForMutation(id: string) {
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

  let createdId: string | undefined

  try {
    if (existing) {
      await updateService(existing.id, { ...data, ...imageData })
    } else {
      const createdService = await createService({ ...data, ...imageData })
      createdId = createdService.id
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
        createdId,
        status: "saved",
        warning:
          error instanceof Error
            ? error.message
            : "Service saved, but the old image needs Storage cleanup.",
      }
    }
  }

  return { createdId, status: "saved" }
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
  getServiceForMutation,
  removeService,
  saveService,
  saveServiceOptions,
  unpublishService,
}
