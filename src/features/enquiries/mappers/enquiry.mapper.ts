import type { Prisma } from "@/db/generated/prisma/client"
import {
  ENQUIRY_DETAIL_VALUE_LABELS,
  ENQUIRY_STATUS_TONES,
  REQUEST_KIND_LABELS,
} from "@/features/enquiries/constants"
import {
  ENQUIRY_DETAIL_SELECT,
  ENQUIRY_LIST_SELECT,
} from "@/features/enquiries/repositories/enquiry.repository"
import type {
  EnquiryDetail,
  EnquiryListItem,
} from "@/features/enquiries/types"
import { resolvePublicStorageObjectUrl } from "@/shared/storage/public-url"

type EnquiryListRecord = Prisma.EnquiryGetPayload<{
  select: typeof ENQUIRY_LIST_SELECT
}>

type EnquiryDetailRecord = Prisma.EnquiryGetPayload<{
  select: typeof ENQUIRY_DETAIL_SELECT
}>

function mapToEnquiryListItem(enquiry: EnquiryListRecord): EnquiryListItem {
  return {
    id: enquiry.id,
    reference: enquiry.reference,
    customerName: enquiry.customerName,
    phoneWhatsApp: enquiry.phoneWhatsApp,
    requestKind: enquiry.requestKind,
    requestKindLabel: REQUEST_KIND_LABELS[enquiry.requestKind],
    itemName: enquiry.itemNameSnapshot,
    receivedLabel: new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(enquiry.createdAt),
    status: enquiry.status,
    statusTone: ENQUIRY_STATUS_TONES[enquiry.status],
  }
}

function formatDate(date: Date | null) {
  return date
    ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(date)
    : null
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function mapToEnquiryDetail(enquiry: EnquiryDetailRecord): EnquiryDetail {
  const linkedRecord = enquiry.artwork ?? enquiry.service
  const linkedName =
    enquiry.artwork?.title ?? enquiry.service?.name ?? enquiry.itemNameSnapshot
  const linkedHref = enquiry.artwork
    ? `/admin/artwork/${enquiry.artwork.id}`
    : enquiry.service
      ? `/admin/services/${enquiry.service.id}`
      : null
  const linkedImagePath =
    enquiry.artwork?.primaryImagePath ?? enquiry.service?.primaryImagePath
  const linkedImageAlt =
    enquiry.artwork?.primaryImageAlt ?? enquiry.service?.primaryImageAlt ?? ""

  return {
    id: enquiry.id,
    reference: enquiry.reference,
    requestKind: enquiry.requestKind,
    requestKindLabel: REQUEST_KIND_LABELS[enquiry.requestKind],
    receivedLabel: formatDateTime(enquiry.createdAt),
    status: enquiry.status,
    statusTone: ENQUIRY_STATUS_TONES[enquiry.status],
    statusChangedLabel:
      enquiry.updatedAt.getTime() - enquiry.createdAt.getTime() > 1000
        ? formatDateTime(enquiry.updatedAt)
        : "Not yet",
    linkedRecord: {
      name: linkedName,
      href: linkedHref,
      imageUrl: resolvePublicStorageObjectUrl(linkedImagePath),
      imageAlt: linkedImageAlt,
      hasLinkedRecord: Boolean(linkedRecord),
      sourceLabel: linkedRecord ? "Linked record" : "Saved snapshot",
    },
    requestDetails: {
      sizeFormat: enquiry.sizeFormat,
      framing: enquiry.framing,
      quantity: enquiry.quantity,
      designReadinessLabel: enquiry.designReadiness
        ? ENQUIRY_DETAIL_VALUE_LABELS[enquiry.designReadiness]
        : null,
      colour: enquiry.colour,
      material: enquiry.material,
      finish: enquiry.finish,
      customerNote: enquiry.customerNote,
    },
    delivery: {
      fulfilmentMethodLabel: enquiry.fulfilmentMethod
        ? ENQUIRY_DETAIL_VALUE_LABELS[enquiry.fulfilmentMethod]
        : null,
      location: enquiry.location,
      preferredDateLabel: formatDate(enquiry.preferredDate),
    },
    contact: {
      customerName: enquiry.customerName,
      phoneWhatsApp: enquiry.phoneWhatsApp,
      email: enquiry.email,
    },
  }
}

export {
  mapToEnquiryDetail,
  mapToEnquiryListItem,
  type EnquiryDetailRecord,
  type EnquiryListRecord,
}
