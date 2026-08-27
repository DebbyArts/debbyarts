import {
  ArtworkCategory,
  AvailabilityStatus,
  PricingMode,
} from "@/db/generated/prisma/enums"
import type {
  ArtworkMutationInput,
  ArtworkRequestOptionsInput,
} from "@/features/artwork/types"

class ArtworkValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ArtworkValidationError"
  }
}

function text(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === "string" ? value.trim() : ""
}

function checked(formData: FormData, name: string) {
  return formData.get(name) === "on" || formData.get(name) === "true"
}

function optionValues(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .filter((value): value is string => typeof value === "string")
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100)
}

function enumValue<T extends string>(
  value: string,
  values: readonly T[],
  label: string
) {
  if (!values.includes(value as T)) {
    throw new ArtworkValidationError(`Choose a valid ${label}.`)
  }
  return value as T
}

function parseDisplayOrder(value: string) {
  const number = Number(value)
  if (!Number.isInteger(number) || number < 0 || number > 9999) {
    throw new ArtworkValidationError(
      "Display order must be a whole number from 0 to 9999."
    )
  }
  return number
}

function parsePrice(mode: PricingMode, value: string) {
  if (mode === PricingMode.NONE) return null

  const normalized = value.replace(/[^0-9.]/g, "")
  const number = Number(normalized)
  if (!normalized || !Number.isFinite(number) || number <= 0) {
    throw new ArtworkValidationError(
      "Enter a positive amount for the selected pricing mode."
    )
  }
  return number.toFixed(2)
}

function parseOptionList(values: string[], label: string) {
  const options = values
    .flatMap((value) => value.split(/[\n,]/))
    .map((option) => option.trim())
    .filter(Boolean)
  const unique = [...new Set(options)]

  if (unique.length > 20 || unique.some((option) => option.length > 80)) {
    throw new ArtworkValidationError(
      `${label} supports up to 20 unique entries of 80 characters each.`
    )
  }
  return unique
}

function parseArtworkMutation(
  formData: FormData,
  options: { hasImage: boolean }
): ArtworkMutationInput {
  const title = text(formData, "title")
  const description = text(formData, "description")
  const primaryImageAlt = text(formData, "primaryImageAlt") || null
  const published = checked(formData, "published")
  const slug = slugify(title)

  if (!title || title.length > 120 || !slug) {
    throw new ArtworkValidationError(
      "Title is required and must be 120 characters or fewer."
    )
  }
  if (!description || description.length > 3000) {
    throw new ArtworkValidationError(
      "Description is required and must be 3,000 characters or fewer."
    )
  }
  if (primaryImageAlt && primaryImageAlt.length > 180) {
    throw new ArtworkValidationError(
      "Image alt text must be 180 characters or fewer."
    )
  }
  if (published && (!options.hasImage || !primaryImageAlt)) {
    throw new ArtworkValidationError(
      "Published artwork requires a primary image and useful alt text."
    )
  }

  const pricingMode = enumValue(
    text(formData, "pricingMode"),
    Object.values(PricingMode),
    "pricing mode"
  )

  return {
    availability: enumValue(
      text(formData, "availability"),
      Object.values(AvailabilityStatus),
      "availability"
    ),
    category: enumValue(
      text(formData, "category"),
      Object.values(ArtworkCategory),
      "category"
    ),
    description,
    displayedPieceDimensions:
      text(formData, "displayedPieceDimensions") || null,
    displayOrder: parseDisplayOrder(text(formData, "displayOrder")),
    featured: checked(formData, "featured"),
    mediumFormat: text(formData, "mediumFormat") || null,
    priceAmount: parsePrice(pricingMode, text(formData, "priceAmount")),
    pricingMode,
    primaryImageAlt,
    published,
    slug,
    title,
  }
}

function parseArtworkRequestOptions(
  formData: FormData
): ArtworkRequestOptionsInput {
  const availableSizesEnabled = checked(formData, "availableSizesEnabled")
  const availableSizes = availableSizesEnabled
    ? parseOptionList(optionValues(formData, "availableSizes"), "Available sizes")
    : []
  const framingEnabled = checked(formData, "framingEnabled")
  const framingOptions = framingEnabled
    ? parseOptionList(optionValues(formData, "framingOptions"), "Framing options")
    : []

  if (framingEnabled && framingOptions.length === 0) {
    throw new ArtworkValidationError(
      "Add at least one framing option or turn framing off."
    )
  }
  if (availableSizesEnabled && availableSizes.length === 0) {
    throw new ArtworkValidationError(
      "Add at least one size option or turn size choices off."
    )
  }

  return {
    askQuantity: checked(formData, "askQuantity"),
    availableSizes,
    framingEnabled,
    framingOptions,
  }
}

function parseArtworkImageAlt(formData: FormData) {
  const value = text(formData, "altText")
  if (value.length > 180) {
    throw new ArtworkValidationError(
      "Image alt text must be 180 characters or fewer."
    )
  }
  return value || null
}

export {
  ArtworkValidationError,
  checked,
  parseArtworkImageAlt,
  parseArtworkMutation,
  parseArtworkRequestOptions,
  parseOptionList,
  slugify,
}
