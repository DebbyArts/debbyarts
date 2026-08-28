import { z } from "zod"

import { PricingMode, ServiceGroup } from "@/db/generated/prisma/enums"

const NAME_ERROR = "Name is required and must be 120 characters or fewer."
const DESCRIPTION_ERROR =
  "Description is required and must be 3,000 characters or fewer."
const IMAGE_ALT_ERROR = "Image alt text must be 180 characters or fewer."
const DISPLAY_ORDER_ERROR =
  "Display order must be a whole number from 0 to 9999."
const PRICE_ERROR = "Enter a positive amount for the selected pricing mode."

function serviceOptionListSchema(label: string) {
  const message = `${label} supports up to 20 unique entries of 80 characters each.`

  return z
    .array(z.string().max(80, { error: message }))
    .max(20, { error: message })
}

const serviceMutationSchema = z
  .object({
    description: z
      .string()
      .min(1, { error: DESCRIPTION_ERROR })
      .max(3000, { error: DESCRIPTION_ERROR }),
    displayOrder: z.coerce
      .number({ error: DISPLAY_ORDER_ERROR })
      .int({ error: DISPLAY_ORDER_ERROR })
      .min(0, { error: DISPLAY_ORDER_ERROR })
      .max(9999, { error: DISPLAY_ORDER_ERROR }),
    group: z.enum(ServiceGroup, {
      error: "Choose a valid service group.",
    }),
    hasImage: z.boolean(),
    name: z
      .string()
      .min(1, { error: NAME_ERROR })
      .max(120, { error: NAME_ERROR }),
    priceAmount: z.string(),
    pricingMode: z.enum(PricingMode, {
      error: "Choose a valid pricing mode.",
    }),
    primaryImageAlt: z.string().max(180, { error: IMAGE_ALT_ERROR }).nullable(),
    published: z.boolean(),
    slug: z.string().min(1, { error: NAME_ERROR }).max(100),
  })
  .superRefine((service, context) => {
    if (service.published && (!service.hasImage || !service.primaryImageAlt)) {
      context.addIssue({
        code: "custom",
        message: "Published services require a primary image and useful alt text.",
        path: ["primaryImageAlt"],
      })
    }

    if (service.pricingMode === PricingMode.NONE) return

    const normalizedAmount = service.priceAmount.replace(/[^0-9.]/g, "")
    const amount = Number(normalizedAmount)

    if (!normalizedAmount || !Number.isFinite(amount) || amount <= 0) {
      context.addIssue({
        code: "custom",
        message: PRICE_ERROR,
        path: ["priceAmount"],
      })
    }
  })
  .transform((service) => ({
    description: service.description,
    displayOrder: service.displayOrder,
    group: service.group,
    name: service.name,
    priceAmount:
      service.pricingMode === PricingMode.NONE
        ? null
        : Number(service.priceAmount.replace(/[^0-9.]/g, "")).toFixed(2),
    pricingMode: service.pricingMode,
    primaryImageAlt: service.primaryImageAlt,
    published: service.published,
    slug: service.slug,
  }))

const serviceRequestOptionsSchema = z
  .object({
    askColour: z.boolean(),
    askDesignReadiness: z.boolean(),
    askFinish: z.boolean(),
    askMaterial: z.boolean(),
    askQuantity: z.boolean(),
    askSizeFormat: z.boolean(),
    materialOptions: serviceOptionListSchema("Material options"),
    sizeFormatOptions: serviceOptionListSchema("Size / format"),
  })
  .superRefine((options, context) => {
    if (options.askSizeFormat && options.sizeFormatOptions.length === 0) {
      context.addIssue({
        code: "custom",
        message:
          "Add at least one size / format option or turn that question off.",
        path: ["sizeFormatOptions"],
      })
    }

    if (options.askMaterial && options.materialOptions.length === 0) {
      context.addIssue({
        code: "custom",
        message: "Add at least one material option or turn that question off.",
        path: ["materialOptions"],
      })
    }
  })

export { serviceMutationSchema, serviceRequestOptionsSchema }
