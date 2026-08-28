"use server"

import { revalidatePath } from "next/cache"
import { ZodError } from "zod"

import { SERVICE_REVALIDATION_PATHS } from "@/features/services/constants"
import { parseServiceRequestOptions } from "@/features/services/parsers/service-form.parser"
import { saveServiceOptions } from "@/features/services/services/service.mutation.service"
import type { ServiceActionState } from "@/features/services/types"
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
        error instanceof ZodError
          ? (error.issues[0]?.message ?? "The request options are invalid.")
          : "The request options could not be saved.",
    }
  }
}

export { saveServiceOptionsAction }
