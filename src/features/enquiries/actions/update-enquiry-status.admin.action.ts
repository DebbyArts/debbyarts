"use server"

import { revalidatePath } from "next/cache"

import { EnquiryStatus } from "@/db/generated/prisma/enums"
import { updateEnquiryStatus } from "@/features/enquiries/services/enquiry.service"
import { requireAdmin } from "@/server/auth/authorize"

async function updateEnquiryStatusAction(
  enquiryId: string,
  statusValue: string
) {
  await requireAdmin()

  if (!Object.values(EnquiryStatus).includes(statusValue as EnquiryStatus)) {
    throw new Error("Invalid enquiry status.")
  }

  await updateEnquiryStatus(enquiryId, statusValue as EnquiryStatus)
  revalidatePath("/admin/enquiries")
  revalidatePath(`/admin/enquiries/${enquiryId}`)
}

export { updateEnquiryStatusAction }
