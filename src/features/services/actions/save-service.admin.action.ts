"use server"

import { revalidatePath } from "next/cache"

import { SERVICE_REVALIDATION_PATHS } from "@/features/services/constants"
import {
  getServiceForSave,
  saveService,
} from "@/features/services/services/service.service"
import type { ServiceActionState } from "@/features/services/types"
import {
  parseServiceMutation,
  ServiceValidationError,
} from "@/features/services/validation/service.validation"
import { requireAdmin } from "@/shared/auth/authorize"
import {
  ImageStorageError,
  ImageValidationError,
} from "@/shared/storage/image-storage"

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

async function saveServiceAction(
  serviceId: string | null,
  _previousState: ServiceActionState,
  formData: FormData
): Promise<ServiceActionState> {
  const admin = await requireAdmin()
  const existing = serviceId ? await getServiceForSave(serviceId) : null

  if (serviceId && !existing) {
    return { status: "error", message: "Service not found." }
  }

  const file = imageFile(formData)
  const removeImage = formData.get("removeImage") === "on"

  try {
    const data = parseServiceMutation(formData, {
      hasImage: Boolean(file || (!removeImage && existing?.primaryImagePath)),
    })
    const result = await saveService({
      admin,
      data,
      existing,
      file,
      removeImage,
    })

    if (result.warning) {
      if (result.status === "saved") {
        SERVICE_REVALIDATION_PATHS.forEach((path) => revalidatePath(path))
      }
      return {
        createdId: result.createdId,
        status: "warning",
        message: result.warning,
      }
    }

    SERVICE_REVALIDATION_PATHS.forEach((path) => revalidatePath(path))
    return {
      createdId: result.createdId,
      status: "success",
      message: "Service saved.",
    }
  } catch (error) {
    return actionError(error)
  }
}

export { saveServiceAction }
