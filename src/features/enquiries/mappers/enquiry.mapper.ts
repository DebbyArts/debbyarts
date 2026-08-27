import type { Prisma } from "@/db/generated/prisma/client"
import {
  ENQUIRY_STATUS_TONES,
  REQUEST_KIND_LABELS,
} from "@/features/enquiries/constants"
import { ENQUIRY_LIST_SELECT } from "@/features/enquiries/repositories/enquiry.repository"
import type { EnquiryListItem } from "@/features/enquiries/types"

type EnquiryListRecord = Prisma.EnquiryGetPayload<{
  select: typeof ENQUIRY_LIST_SELECT
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

export { mapToEnquiryListItem, type EnquiryListRecord }
