import type { SeedImage } from "@/db/seed/media/asset-loader"

type ServiceRequestDefaults = {
  askQuantity: boolean
  askSizeFormat: boolean
  sizeFormatOptions: readonly []
  askDesignReadiness: boolean
  askColour: boolean
  askMaterial: false
  materialOptions: readonly []
  askFinish: boolean
}

type ServiceSeedData = {
  slug: string
  name: string
  description: string
  group: "PERSONALISED_PRODUCTS" | "PRINT_EVENT_MATERIALS" | "BRANDING_SIGNAGE"
  pricingMode: "NONE"
  priceAmount: null
  published: boolean
  displayOrder: number
  primaryImage: SeedImage | null
  requestDefaults: ServiceRequestDefaults
}

const NO_SERVICE_OPTIONS = {
  sizeFormatOptions: [],
  askMaterial: false,
  materialOptions: [],
} as const

const seedServices: ServiceSeedData[] = [
  {
    slug: "painting-pencil-portraits",
    name: "Painting & Pencil Portraits",
    description:
      "Commissioned paintings and pencil portraits developed from a customer brief or reference.",
    group: "PERSONALISED_PRODUCTS",
    pricingMode: "NONE",
    priceAmount: null,
    published: false,
    displayOrder: 1,
    primaryImage: null,
    requestDefaults: {
      askQuantity: false,
      askSizeFormat: false,
      askDesignReadiness: true,
      askColour: false,
      askFinish: false,
      ...NO_SERVICE_OPTIONS,
    },
  },
  {
    slug: "custom-artwork-framed-art-prints",
    name: "Custom Artwork & Framed Art Prints",
    description:
      "Custom artwork and framed art-print pieces for personal gifts, display and special projects.",
    group: "PERSONALISED_PRODUCTS",
    pricingMode: "NONE",
    priceAmount: null,
    published: false,
    displayOrder: 2,
    primaryImage: null,
    requestDefaults: {
      askQuantity: false,
      askSizeFormat: false,
      askDesignReadiness: true,
      askColour: true,
      askFinish: true,
      ...NO_SERVICE_OPTIONS,
    },
  },
  {
    slug: "digital-artwork-designs",
    name: "Digital Artwork & Designs",
    description: "Digital artwork and design work created around a customer brief.",
    group: "BRANDING_SIGNAGE",
    pricingMode: "NONE",
    priceAmount: null,
    published: false,
    displayOrder: 3,
    primaryImage: null,
    requestDefaults: {
      askQuantity: false,
      askSizeFormat: false,
      askDesignReadiness: true,
      askColour: true,
      askFinish: false,
      ...NO_SERVICE_OPTIONS,
    },
  },
  {
    slug: "customised-t-shirts",
    name: "Customized T-Shirts",
    description: "Customized T-shirts for individual, group and branded orders.",
    group: "PERSONALISED_PRODUCTS",
    pricingMode: "NONE",
    priceAmount: null,
    published: true,
    displayOrder: 4,
    primaryImage: {
      path: "images/seed/services/customised-t-shirts/cover.webp",
      alt: "White customized T-shirt with a name and number",
      width: 1350,
      height: 1800,
    },
    requestDefaults: {
      askQuantity: true,
      askSizeFormat: false,
      askDesignReadiness: true,
      askColour: true,
      askFinish: false,
      ...NO_SERVICE_OPTIONS,
    },
  },
  {
    slug: "photo-frames-throw-pillows",
    name: "Photo Frames & Throw Pillows",
    description: "Photo-led gifts, framed pieces and customized throw pillows.",
    group: "PERSONALISED_PRODUCTS",
    pricingMode: "NONE",
    priceAmount: null,
    published: true,
    displayOrder: 5,
    primaryImage: {
      path: "images/seed/services/photo-gifts-and-pillows/cover.webp",
      alt: "Customized throw pillow with a birthday message",
      width: 1080,
      height: 809,
    },
    requestDefaults: {
      askQuantity: true,
      askSizeFormat: false,
      askDesignReadiness: true,
      askColour: false,
      askFinish: false,
      ...NO_SERVICE_OPTIONS,
    },
  },
  {
    slug: "invitation-cards-programmes",
    name: "Invitation Cards & Programmes",
    description: "Invitation cards and programmes for events and occasions.",
    group: "PRINT_EVENT_MATERIALS",
    pricingMode: "NONE",
    priceAmount: null,
    published: false,
    displayOrder: 6,
    primaryImage: null,
    requestDefaults: {
      askQuantity: true,
      askSizeFormat: false,
      askDesignReadiness: true,
      askColour: true,
      askFinish: false,
      ...NO_SERVICE_OPTIONS,
    },
  },
  {
    slug: "business-cards-general-printing",
    name: "Business Cards & General Printing",
    description: "Business cards and general print materials for businesses and events.",
    group: "PRINT_EVENT_MATERIALS",
    pricingMode: "NONE",
    priceAmount: null,
    published: false,
    displayOrder: 7,
    primaryImage: null,
    requestDefaults: {
      askQuantity: true,
      askSizeFormat: false,
      askDesignReadiness: true,
      askColour: true,
      askFinish: true,
      ...NO_SERVICE_OPTIONS,
    },
  },
  {
    slug: "paper-bags-packaging",
    name: "Paper Bags & Packaging",
    description: "Paper bags and packaging for branded products and events.",
    group: "PRINT_EVENT_MATERIALS",
    pricingMode: "NONE",
    priceAmount: null,
    published: false,
    displayOrder: 8,
    primaryImage: null,
    requestDefaults: {
      askQuantity: true,
      askSizeFormat: false,
      askDesignReadiness: true,
      askColour: true,
      askFinish: false,
      ...NO_SERVICE_OPTIONS,
    },
  },
  {
    slug: "rubber-stamps-company-seals",
    name: "Rubber Stamps & Company Seals",
    description: "Rubber stamps and company seals for business use.",
    group: "BRANDING_SIGNAGE",
    pricingMode: "NONE",
    priceAmount: null,
    published: false,
    displayOrder: 9,
    primaryImage: null,
    requestDefaults: {
      askQuantity: true,
      askSizeFormat: false,
      askDesignReadiness: true,
      askColour: false,
      askFinish: false,
      ...NO_SERVICE_OPTIONS,
    },
  },
  {
    slug: "award-plaques",
    name: "Award Plaques",
    description: "Custom award plaques for recognition and presentation occasions.",
    group: "PRINT_EVENT_MATERIALS",
    pricingMode: "NONE",
    priceAmount: null,
    published: true,
    displayOrder: 10,
    primaryImage: {
      path: "images/seed/services/award-plaques/cover.webp",
      alt: "Collection of custom award plaques",
      width: 960,
      height: 540,
    },
    requestDefaults: {
      askQuantity: true,
      askSizeFormat: false,
      askDesignReadiness: true,
      askColour: false,
      askFinish: true,
      ...NO_SERVICE_OPTIONS,
    },
  },
  {
    slug: "digital-banners",
    name: "Digital Banners",
    description: "Digital banners designed for business, event and promotional needs.",
    group: "BRANDING_SIGNAGE",
    pricingMode: "NONE",
    priceAmount: null,
    published: false,
    displayOrder: 11,
    primaryImage: null,
    requestDefaults: {
      askQuantity: false,
      askSizeFormat: false,
      askDesignReadiness: true,
      askColour: true,
      askFinish: false,
      ...NO_SERVICE_OPTIONS,
    },
  },
  {
    slug: "screen-printing",
    name: "Screen Printing",
    description: "Screen printing for customised clothing and branded print orders.",
    group: "PRINT_EVENT_MATERIALS",
    pricingMode: "NONE",
    priceAmount: null,
    published: true,
    displayOrder: 12,
    primaryImage: {
      path: "images/seed/services/screen-printing/cover.webp",
      alt: "Batch of printed black garments in the studio",
      width: 1350,
      height: 1800,
    },
    requestDefaults: {
      askQuantity: true,
      askSizeFormat: false,
      askDesignReadiness: true,
      askColour: true,
      askFinish: false,
      ...NO_SERVICE_OPTIONS,
    },
  },
  {
    slug: "signage-creative-painting",
    name: "Signage & Creative Painting",
    description: "Signage and creative painting for brands, spaces and projects.",
    group: "BRANDING_SIGNAGE",
    pricingMode: "NONE",
    priceAmount: null,
    published: true,
    displayOrder: 13,
    primaryImage: {
      path: "images/seed/services/branded-products/cover.webp",
      alt: "White hard hat with a printed brand mark",
      width: 1350,
      height: 1800,
    },
    requestDefaults: {
      askQuantity: true,
      askSizeFormat: false,
      askDesignReadiness: true,
      askColour: true,
      askFinish: false,
      ...NO_SERVICE_OPTIONS,
    },
  },
]

export { seedServices, type ServiceRequestDefaults, type ServiceSeedData }
