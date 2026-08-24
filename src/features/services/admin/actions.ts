"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import {
  parseServiceMutation,
  parseServiceRequestOptions,
  ServiceValidationError,
} from "@/features/services/admin/service-validation"
import { requireAdmin } from "@/server/auth/authorize"
import {
  deleteCatalogueImage,
  ImageStorageError,
  ImageValidationError,
  uploadCatalogueImage,
} from "@/server/storage/image-storage"
import type { ServiceActionState } from "@/features/services/admin/state"

function imageFile(formData: FormData) {
  const value = formData.get("primaryImage")
  return value instanceof File && value.size > 0 ? value : null
}

function actionError(error: unknown): ServiceActionState {
  if (
    error instanceof ServiceValidationError ||
    error instanceof ImageValidationError ||
    error instanceof ImageStorageError
  ) {
    return { status: "error", message: error.message }
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  ) {
    return {
      status: "error",
      message: "Another service already uses this name-derived slug.",
    }
  }
  return {
    status: "error",
    message: "The service could not be saved. No hidden fallback was applied.",
  }
}

function revalidateServices() {
  revalidatePath("/admin/services")
  revalidatePath("/services")
  revalidatePath("/request")
}

async function saveServiceAction(
  serviceId: string | null,
  _previousState: ServiceActionState,
  formData: FormData
): Promise<ServiceActionState> {
  const admin = await requireAdmin()
  const { prisma } = await import("@/db/client")
  const existing = serviceId
    ? await prisma.service.findUnique({ where: { id: serviceId } })
    : null
  if (serviceId && !existing) {
    return { status: "error", message: "Service not found." }
  }

  const file = imageFile(formData)
  const removeImage = formData.get("removeImage") === "on"
  let uploadedPath: string | null = null

  try {
    const input = parseServiceMutation(formData, {
      hasImage: Boolean(file || (!removeImage && existing?.primaryImagePath)),
    })
    const uploaded = file
      ? await uploadCatalogueImage(admin, "service", file)
      : null
    uploadedPath = uploaded?.path ?? null
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
        await prisma.service.update({
          where: { id: existing.id },
          data: { ...input, ...imageData },
        })
      } else {
        await prisma.service.create({ data: { ...input, ...imageData } })
      }
    } catch (error) {
      if (uploadedPath) {
        try {
          await deleteCatalogueImage(admin, "service", uploadedPath)
        } catch {
          return {
            status: "warning",
            message:
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
        revalidateServices()
        return {
          status: "warning",
          message:
            error instanceof Error
              ? error.message
              : "Service saved, but the old image needs Storage cleanup.",
        }
      }
    }

    revalidateServices()
    return { status: "success", message: "Service saved." }
  } catch (error) {
    return actionError(error)
  }
}

async function saveServiceOptionsAction(
  serviceId: string,
  _previousState: ServiceActionState,
  formData: FormData
): Promise<ServiceActionState> {
  await requireAdmin()
  const { prisma } = await import("@/db/client")
  try {
    const data = parseServiceRequestOptions(formData)
    await prisma.service.update({ where: { id: serviceId }, data })
    revalidateServices()
    return { status: "success", message: "Request options saved." }
  } catch (error) {
    return actionError(error)
  }
}

async function unpublishServiceAction(serviceId: string) {
  await requireAdmin()
  const { prisma } = await import("@/db/client")
  await prisma.service.update({
    where: { id: serviceId },
    data: { published: false },
  })
  revalidateServices()
}

async function deleteServiceAction(serviceId: string) {
  const admin = await requireAdmin()
  const { prisma } = await import("@/db/client")
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { primaryImagePath: true },
  })
  if (!service) redirect("/admin/services")

  await prisma.service.delete({ where: { id: serviceId } })
  if (service.primaryImagePath) {
    await deleteCatalogueImage(admin, "service", service.primaryImagePath)
  }
  revalidateServices()
  redirect("/admin/services?deleted=1")
}

export {
  deleteServiceAction,
  saveServiceAction,
  saveServiceOptionsAction,
  unpublishServiceAction,
}
