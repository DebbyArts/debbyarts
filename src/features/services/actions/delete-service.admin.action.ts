"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { SERVICE_REVALIDATION_PATHS } from "@/features/services/constants"
import { removeService } from "@/features/services/services/service.mutation.service"
import { requireAdmin } from "@/shared/auth/authorize"

async function deleteServiceAction(serviceId: string) {
  const admin = await requireAdmin()
  const result = await removeService(admin, serviceId)

  if (!result) redirect("/admin/services")

  SERVICE_REVALIDATION_PATHS.forEach((path) => revalidatePath(path))
  redirect(
    result.cleanupPath
      ? `/admin/services?deleted=1&cleanup=${encodeURIComponent(result.cleanupPath)}`
      : "/admin/services?deleted=1"
  )
}

export { deleteServiceAction }
