import "server-only"

import { createEnquiry } from "@/features/enquiries/create-enquiry"
import type { RequestDraft } from "@/features/enquiries/request-types"
import { getPublishedRequestArtwork } from "@/features/artwork/server/get-request-artworks"
import { getPublishedRequestService } from "@/features/services/server/get-request-services"

async function persistEnquiry(draft: RequestDraft, websiteOrigin: string | null) {
  return createEnquiry(draft, websiteOrigin, {
    findArtwork: getPublishedRequestArtwork,
    findService: getPublishedRequestService,
    async findDuplicate(enquiry, createdAfter) {
      const { prisma } = await import("@/db/client")

      return prisma.enquiry.findFirst({
        where: {
          createdAt: { gte: createdAfter },
          requestKind: enquiry.requestKind,
          artworkId: enquiry.artworkId,
          serviceId: enquiry.serviceId,
          itemNameSnapshot: enquiry.itemNameSnapshot,
          itemSlugSnapshot: enquiry.itemSlugSnapshot,
          quantity: enquiry.quantity,
          sizeFormat: enquiry.sizeFormat,
          framing: enquiry.framing,
          designReadiness: enquiry.designReadiness,
          colour: enquiry.colour,
          material: enquiry.material,
          finish: enquiry.finish,
          fulfilmentMethod: enquiry.fulfilmentMethod,
          location: enquiry.location,
          preferredDate: enquiry.preferredDate,
          customerName: enquiry.customerName,
          phoneWhatsApp: enquiry.phoneWhatsApp,
          email: enquiry.email,
          customerNote: enquiry.customerNote,
        },
        orderBy: { createdAt: "desc" },
        select: { reference: true },
      })
    },
    async create(record) {
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
    },
  })
}

export { persistEnquiry }
