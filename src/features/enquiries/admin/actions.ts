"use server"

import { revalidatePath } from "next/cache"

import { EnquiryStatus } from "@/db/generated/prisma/enums"
import { requireAdmin } from "@/server/auth/authorize"

async function updateEnquiryStatusAction(
  enquiryId: string,
  statusValue: string
) {
  await requireAdmin()
  const { prisma } = await import("@/db/client")

  if (!Object.values(EnquiryStatus).includes(statusValue as EnquiryStatus)) {
    throw new Error("Invalid enquiry status.")
  }

  await prisma.enquiry.update({
    where: { id: enquiryId },
    data: { status: statusValue as EnquiryStatus },
  })
  revalidatePath("/admin/enquiries")
  revalidatePath(`/admin/enquiries/${enquiryId}`)
}

export { updateEnquiryStatusAction }
