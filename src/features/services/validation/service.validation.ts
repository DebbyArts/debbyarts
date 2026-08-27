import { PricingMode, ServiceGroup } from "@/db/generated/prisma/enums"
import type {
  ServiceMutationInput,
  ServiceRequestOptionsInput,
} from "@/features/services/types"

class ServiceValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ServiceValidationError"
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

function parseDisplayOrder(value: string) {
  const number = Number(value)
  if (!Number.isInteger(number) || number < 0 || number > 9999) {
    throw new ServiceValidationError(
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
    throw new ServiceValidationError(
      "Enter a positive amount for the selected pricing mode."
    )
  }
  return number.toFixed(2)
}

function parseOptionList(values: string[]) {
  const options = values
    .flatMap((value) => value.split(/[\n,]/))
    .map((option) => option.trim())
    .filter(Boolean)
  const unique = [...new Set(options)]

  if (unique.length > 20 || unique.some((option) => option.length > 80)) {
    throw new ServiceValidationError(
      "Size / format supports up to 20 unique entries of 80 characters each."
    )
  }
  return unique
}

function parseServiceMutation(
  formData: FormData,
  options: { hasImage: boolean }
): ServiceMutationInput {
  const name = text(formData, "name")
  const slug = slugify(name)
  const description = text(formData, "description")
  const published = checked(formData, "published")
  const primaryImageAlt = text(formData, "primaryImageAlt") || null
  const groupValue = text(formData, "group")
  const pricingModeValue = text(formData, "pricingMode")

  if (!name || name.length > 120 || !slug) {
    throw new ServiceValidationError(
      "Name is required and must be 120 characters or fewer."
    )
  }
  if (!description || description.length > 3000) {
    throw new ServiceValidationError(
      "Description is required and must be 3,000 characters or fewer."
    )
  }
  if (!Object.values(ServiceGroup).includes(groupValue as ServiceGroup)) {
    throw new ServiceValidationError("Choose a valid service group.")
  }
  if (!Object.values(PricingMode).includes(pricingModeValue as PricingMode)) {
    throw new ServiceValidationError("Choose a valid pricing mode.")
  }
  if (primaryImageAlt && primaryImageAlt.length > 180) {
    throw new ServiceValidationError(
      "Image alt text must be 180 characters or fewer."
    )
  }
  if (published && (!options.hasImage || !primaryImageAlt)) {
    throw new ServiceValidationError(
      "Published services require a primary image and useful alt text."
    )
  }

  const pricingMode = pricingModeValue as PricingMode
  return {
    description,
    displayOrder: parseDisplayOrder(text(formData, "displayOrder")),
    group: groupValue as ServiceGroup,
    name,
    priceAmount: parsePrice(pricingMode, text(formData, "priceAmount")),
    pricingMode,
    primaryImageAlt,
    published,
    slug,
  }
}

function parseServiceRequestOptions(
  formData: FormData
): ServiceRequestOptionsInput {
  const askSizeFormat = checked(formData, "askSizeFormat")
  const sizeFormatOptions = askSizeFormat
    ? parseOptionList(optionValues(formData, "sizeFormatOptions"))
    : []

  if (askSizeFormat && sizeFormatOptions.length === 0) {
    throw new ServiceValidationError(
      "Add at least one size / format option or turn that question off."
    )
  }

  return {
    askColour: checked(formData, "askColour"),
    askDesignReadiness: checked(formData, "askDesignReadiness"),
    askFinish: checked(formData, "askFinish"),
    askMaterial: checked(formData, "askMaterial"),
    askQuantity: checked(formData, "askQuantity"),
    askSizeFormat,
    sizeFormatOptions,
  }
}

export {
  ServiceValidationError,
  parseServiceMutation,
  parseServiceRequestOptions,
  slugify,
}
