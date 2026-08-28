"use server"

import { revalidatePath } from "next/cache"

import { SERVICE_REVALIDATION_PATHS } from "@/features/services/constants"
import { saveServiceOptions } from "@/features/services/services/service.service"
import type { ServiceActionState } from "@/features/services/types"
import {
  parseServiceRequestOptions,
  ServiceValidationError,
} from "@/features/services/validation/service.validation"
import { requireAdmin } from "@/shared/auth/authorize"

async function saveServiceOptionsAction(
  serviceId: string,
  _previousState: ServiceActionState,
  formData: FormData
): Promise<ServiceActionState> {
  await requireAdmin()

  try {
    const data = parseServiceRequestOptions(formData)
    await saveServiceOptions(serviceId, data)
    SERVICE_REVALIDATION_PATHS.forEach((path) => revalidatePath(path))
    return { status: "success", message: "Request options saved." }
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof ServiceValidationError
          ? error.message
          : "The request options could not be saved.",
    }
  }
}

export { saveServiceOptionsAction }
