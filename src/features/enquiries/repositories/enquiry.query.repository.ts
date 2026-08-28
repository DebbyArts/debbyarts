import { EnquiryStatus } from "@/db/generated/prisma/enums"
import { ENQUIRIES_PAGE_SIZE } from "@/features/enquiries/constants"
import {
  ENQUIRY_DETAIL_SELECT,
  ENQUIRY_LIST_SELECT,
  REQUEST_ARTWORK_SELECT,
  REQUEST_SERVICE_SELECT,
} from "@/features/enquiries/repositories/enquiry.queries"
import type {
  EnquiryListFilters,
  NormalizedEnquiryInput,
} from "@/features/enquiries/types"

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

async function findEnquiryDetail(id: string) {
  const { prisma } = await import("@/db/client")

  return prisma.enquiry.findUnique({
    where: { id },
    select: ENQUIRY_DETAIL_SELECT,
  })
}

async function findPublishedRequestArtworks() {
  const { prisma } = await import("@/db/client")

  return prisma.artwork.findMany({
    where: { published: true },
    select: REQUEST_ARTWORK_SELECT,
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }, { id: "asc" }],
  })
}

async function findPublishedRequestArtwork(slug: string) {
  const { prisma } = await import("@/db/client")

  return prisma.artwork.findFirst({
    where: { slug, published: true },
    select: REQUEST_ARTWORK_SELECT,
  })
}

async function findPublishedRequestServices() {
  const { prisma } = await import("@/db/client")

  return prisma.service.findMany({
    where: { published: true },
    select: REQUEST_SERVICE_SELECT,
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }, { slug: "asc" }],
  })
}

async function findPublishedRequestService(slug: string) {
  const { prisma } = await import("@/db/client")

  return prisma.service.findFirst({
    where: { slug, published: true },
    select: REQUEST_SERVICE_SELECT,
  })
}

export {
  findEnquiryDetail,
  findEnquiryList,
  findPublishedRequestArtwork,
  findPublishedRequestArtworks,
  findPublishedRequestService,
  findPublishedRequestServices,
  findRecentDuplicate,
}
