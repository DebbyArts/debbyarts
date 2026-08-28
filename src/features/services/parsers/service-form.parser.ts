import {
  serviceMutationSchema,
  serviceRequestOptionsSchema,
} from "@/features/services/schemas/service.schema"
import type {
  ServiceMutationInput,
  ServiceRequestOptionsInput,
} from "@/features/services/types"
import { normalizeServiceSlug } from "@/features/services/utils/service-slug.utils"

function formText(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === "string" ? value.trim() : ""
}

function formCheckbox(formData: FormData, name: string) {
  const value = formData.get(name)
  return value === "on" || value === "true"
}

function formOptionValues(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .filter((value): value is string => typeof value === "string")
    .flatMap((value) => value.split(/[\n,]/))
    .map((option) => option.trim())
    .filter(Boolean)
    .filter((option, index, options) => options.indexOf(option) === index)
}

function parseServiceMutation(
  formData: FormData,
  options: { hasImage: boolean }
): ServiceMutationInput {
  const name = formText(formData, "name")

  return serviceMutationSchema.parse({
    description: formText(formData, "description"),
    displayOrder: formText(formData, "displayOrder"),
    group: formText(formData, "group"),
    hasImage: options.hasImage,
    name,
    priceAmount: formText(formData, "priceAmount"),
    pricingMode: formText(formData, "pricingMode"),
    primaryImageAlt: formText(formData, "primaryImageAlt") || null,
    published: formCheckbox(formData, "published"),
    slug: normalizeServiceSlug(name),
  })
}

function parseServiceRequestOptions(
  formData: FormData
): ServiceRequestOptionsInput {
  const askSizeFormat = formCheckbox(formData, "askSizeFormat")
  const askMaterial = formCheckbox(formData, "askMaterial")

  return serviceRequestOptionsSchema.parse({
    askColour: formCheckbox(formData, "askColour"),
    askDesignReadiness: formCheckbox(formData, "askDesignReadiness"),
    askFinish: formCheckbox(formData, "askFinish"),
    askMaterial,
    askQuantity: formCheckbox(formData, "askQuantity"),
    askSizeFormat,
    materialOptions: askMaterial
      ? formOptionValues(formData, "materialOptions")
      : [],
    sizeFormatOptions: askSizeFormat
      ? formOptionValues(formData, "sizeFormatOptions")
      : [],
  })
}

export { parseServiceMutation, parseServiceRequestOptions }
