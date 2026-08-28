"use server"

import { revalidatePath } from "next/cache"

import { enquiryStatusSchema } from "@/features/enquiries/schemas/enquiry.schema"
import { updateEnquiryStatus } from "@/features/enquiries/services/enquiry.mutation.service"
import { requireAdmin } from "@/shared/auth/authorize"

async function updateEnquiryStatusAction(
  enquiryId: string,
  statusValue: string
) {
  await requireAdmin()

  const status = enquiryStatusSchema.parse(statusValue)
  await updateEnquiryStatus(enquiryId, status)
  revalidatePath("/admin/enquiries")
  revalidatePath(`/admin/enquiries/${enquiryId}`)
}

export { updateEnquiryStatusAction }
