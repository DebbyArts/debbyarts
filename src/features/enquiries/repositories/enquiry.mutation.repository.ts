import { EnquiryStatus } from "@/db/generated/prisma/enums"
import type { EnquiryPersistenceInput } from "@/features/enquiries/types"

async function createEnquiryRecord(record: EnquiryPersistenceInput) {
  const { prisma } = await import("@/db/client")

  await prisma.enquiry.create({
    data: {
      reference: record.reference,
      requestKind: record.requestKind,
      artworkId: record.artworkId,
      serviceId: record.serviceId,
      itemNameSnapshot: record.itemNameSnapshot,
      itemSlugSnapshot: record.itemSlugSnapshot,
      quantity: record.quantity,
      sizeFormat: record.sizeFormat,
      framing: record.framing,
      designReadiness: record.designReadiness,
      colour: record.colour,
      material: record.material,
      finish: record.finish,
      fulfilmentMethod: record.fulfilmentMethod,
      location: record.location,
      preferredDate: record.preferredDate,
      customerName: record.customerName,
      phoneWhatsApp: record.phoneWhatsApp,
      email: record.email,
      customerNote: record.customerNote,
      whatsappSummary: record.whatsappSummary,
    },
  })
}

async function updateEnquiryStatus(id: string, status: EnquiryStatus) {
  const { prisma } = await import("@/db/client")
  return prisma.enquiry.update({ where: { id }, data: { status } })
}

export { createEnquiryRecord, updateEnquiryStatus }
