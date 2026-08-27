import type { Prisma } from "@/db/generated/prisma/client"
import { EnquiryStatus } from "@/db/generated/prisma/enums"
import { ENQUIRIES_PAGE_SIZE } from "@/features/enquiries/constants"
import type {
  EnquiryListFilters,
  EnquiryPersistenceInput,
  NormalizedEnquiryInput,
} from "@/features/enquiries/types"

const ENQUIRY_LIST_SELECT = {
  id: true,
  reference: true,
  customerName: true,
  phoneWhatsApp: true,
  requestKind: true,
  itemNameSnapshot: true,
  createdAt: true,
  status: true,
} satisfies Prisma.EnquirySelect

function enquiryListWhere(filters: EnquiryListFilters) {
  return {
    requestKind: filters.kind,
    status: filters.status,
    OR: filters.search
      ? [
          { reference: { contains: filters.search, mode: "insensitive" as const } },
          { customerName: { contains: filters.search, mode: "insensitive" as const } },
          { phoneWhatsApp: { contains: filters.search } },
        ]
      : undefined,
  }
}

async function findRecentDuplicate(
  enquiry: NormalizedEnquiryInput,
  createdAfter: Date
) {
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
}

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

async function findEnquiryList(filters: EnquiryListFilters) {
  const { prisma } = await import("@/db/client")
  const where = enquiryListWhere(filters)
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const [enquiries, total, newToday] = await Promise.all([
    prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (filters.page - 1) * ENQUIRIES_PAGE_SIZE,
      take: ENQUIRIES_PAGE_SIZE,
      select: ENQUIRY_LIST_SELECT,
    }),
    prisma.enquiry.count({ where }),
    prisma.enquiry.count({
      where: { status: EnquiryStatus.NEW, createdAt: { gte: startOfToday } },
    }),
  ])

  return { enquiries, total, newToday }
}

export {
  ENQUIRY_LIST_SELECT,
  createEnquiryRecord,
  findEnquiryList,
  findRecentDuplicate,
  updateEnquiryStatus,
}
