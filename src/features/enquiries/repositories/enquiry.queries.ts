import type { Prisma } from "@/db/generated/prisma/client"

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

const ENQUIRY_DETAIL_SELECT = {
  id: true,
  reference: true,
  status: true,
  requestKind: true,
  itemNameSnapshot: true,
  quantity: true,
  sizeFormat: true,
  framing: true,
  designReadiness: true,
  colour: true,
  material: true,
  finish: true,
  fulfilmentMethod: true,
  location: true,
  preferredDate: true,
  customerName: true,
  phoneWhatsApp: true,
  email: true,
  customerNote: true,
  createdAt: true,
  updatedAt: true,
  artwork: {
    select: {
      id: true,
      title: true,
      primaryImagePath: true,
      primaryImageAlt: true,
    },
  },
  service: {
    select: {
      id: true,
      name: true,
      primaryImagePath: true,
      primaryImageAlt: true,
    },
  },
} satisfies Prisma.EnquirySelect

const REQUEST_ARTWORK_SELECT = {
  id: true,
  slug: true,
  title: true,
  category: true,
  primaryImagePath: true,
  primaryImageAlt: true,
  availableSizes: true,
  framingEnabled: true,
  framingOptions: true,
  askQuantity: true,
} satisfies Prisma.ArtworkSelect

const REQUEST_SERVICE_SELECT = {
  id: true,
  slug: true,
  name: true,
  group: true,
  primaryImagePath: true,
  primaryImageAlt: true,
  askQuantity: true,
  askSizeFormat: true,
  sizeFormatOptions: true,
  askDesignReadiness: true,
  askColour: true,
  askMaterial: true,
  materialOptions: true,
  askFinish: true,
} satisfies Prisma.ServiceSelect

export {
  ENQUIRY_DETAIL_SELECT,
  ENQUIRY_LIST_SELECT,
  REQUEST_ARTWORK_SELECT,
  REQUEST_SERVICE_SELECT,
}
