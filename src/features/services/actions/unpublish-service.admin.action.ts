"use server"

import { revalidatePath } from "next/cache"

import { SERVICE_REVALIDATION_PATHS } from "@/features/services/constants"
import { unpublishService } from "@/features/services/services/service.service"
import { requireAdmin } from "@/server/auth/authorize"

async function unpublishServiceAction(serviceId: string) {
  await requireAdmin()
  await unpublishService(serviceId)
  SERVICE_REVALIDATION_PATHS.forEach((path) => revalidatePath(path))
}

export { unpublishServiceAction }
