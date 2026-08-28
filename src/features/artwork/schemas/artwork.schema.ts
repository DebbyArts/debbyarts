import { z } from "zod"

import {
  ArtworkCategory,
  AvailabilityStatus,
  PricingMode,
} from "@/db/generated/prisma/enums"

const TITLE_ERROR =
  "Title is required and must be 120 characters or fewer."
const DESCRIPTION_ERROR =
  "Description is required and must be 3,000 characters or fewer."
const IMAGE_ALT_ERROR = "Image alt text must be 180 characters or fewer."
const DISPLAY_ORDER_ERROR =
  "Display order must be a whole number from 0 to 9999."
const PRICE_ERROR = "Enter a positive amount for the selected pricing mode."

function artworkOptionListSchema(label: string) {
  const message = `${label} supports up to 20 unique entries of 80 characters each.`

  return z
    .array(z.string().max(80, { error: message }))
    .max(20, { error: message })
}

const artworkMutationSchema = z
  .object({
    availability: z.enum(AvailabilityStatus, {
      error: "Choose a valid availability.",
    }),
    category: z.enum(ArtworkCategory, {
      error: "Choose a valid category.",
    }),
    description: z
      .string()
      .min(1, { error: DESCRIPTION_ERROR })
      .max(3000, { error: DESCRIPTION_ERROR }),
    displayedPieceDimensions: z.string().nullable(),
    displayOrder: z.coerce
      .number({ error: DISPLAY_ORDER_ERROR })
      .int({ error: DISPLAY_ORDER_ERROR })
      .min(0, { error: DISPLAY_ORDER_ERROR })
      .max(9999, { error: DISPLAY_ORDER_ERROR }),
    featured: z.boolean(),
    hasImage: z.boolean(),
    mediumFormat: z.string().nullable(),
    priceAmount: z.string(),
    pricingMode: z.enum(PricingMode, {
      error: "Choose a valid pricing mode.",
    }),
    primaryImageAlt: z.string().max(180, { error: IMAGE_ALT_ERROR }).nullable(),
    published: z.boolean(),
    slug: z.string().min(1, { error: TITLE_ERROR }).max(100),
    title: z
      .string()
      .min(1, { error: TITLE_ERROR })
      .max(120, { error: TITLE_ERROR }),
  })
  .superRefine((artwork, context) => {
    if (
      artwork.published &&
      (!artwork.hasImage || !artwork.primaryImageAlt)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Published artwork requires a primary image and useful alt text.",
        path: ["primaryImageAlt"],
      })
    }

    if (artwork.pricingMode === PricingMode.NONE) return

    const normalizedAmount = artwork.priceAmount.replace(/[^0-9.]/g, "")
    const amount = Number(normalizedAmount)

    if (!normalizedAmount || !Number.isFinite(amount) || amount <= 0) {
      context.addIssue({
        code: "custom",
        message: PRICE_ERROR,
        path: ["priceAmount"],
      })
    }
  })
  .transform((artwork) => ({
    availability: artwork.availability,
    category: artwork.category,
    description: artwork.description,
    displayedPieceDimensions: artwork.displayedPieceDimensions,
    displayOrder: artwork.displayOrder,
    featured: artwork.featured,
    mediumFormat: artwork.mediumFormat,
    priceAmount:
      artwork.pricingMode === PricingMode.NONE
        ? null
        : Number(artwork.priceAmount.replace(/[^0-9.]/g, "")).toFixed(2),
    pricingMode: artwork.pricingMode,
    primaryImageAlt: artwork.primaryImageAlt,
    published: artwork.published,
    slug: artwork.slug,
    title: artwork.title,
  }))

const artworkRequestOptionsSchema = z
  .object({
    askQuantity: z.boolean(),
    availableSizes: artworkOptionListSchema("Available sizes"),
    availableSizesEnabled: z.boolean(),
    framingEnabled: z.boolean(),
    framingOptions: artworkOptionListSchema("Framing options"),
  })
  .superRefine((options, context) => {
    if (options.framingEnabled && options.framingOptions.length === 0) {
      context.addIssue({
        code: "custom",
        message: "Add at least one framing option or turn framing off.",
        path: ["framingOptions"],
      })
    }

    if (
      options.availableSizesEnabled &&
      options.availableSizes.length === 0
    ) {
      context.addIssue({
        code: "custom",
        message: "Add at least one size option or turn size choices off.",
        path: ["availableSizes"],
      })
    }
  })
  .transform((options) => ({
    askQuantity: options.askQuantity,
    availableSizes: options.availableSizes,
    framingEnabled: options.framingEnabled,
    framingOptions: options.framingOptions,
  }))

const artworkImageAltSchema = z
  .string()
  .max(180, { error: IMAGE_ALT_ERROR })
  .nullable()

export {
  artworkImageAltSchema,
  artworkMutationSchema,
  artworkRequestOptionsSchema,
}
