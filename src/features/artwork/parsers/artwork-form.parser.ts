import {
  artworkImageAltSchema,
  artworkMutationSchema,
  artworkRequestOptionsSchema,
} from "@/features/artwork/schemas/artwork.schema"
import type {
  ArtworkImageAltInput,
  ArtworkMutationInput,
  ArtworkRequestOptionsInput,
} from "@/features/artwork/types"
import { normalizeArtworkSlug } from "@/features/artwork/utils/artwork-slug.utils"

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

function parseArtworkMutation(
  formData: FormData,
  options: { hasImage: boolean }
): ArtworkMutationInput {
  const title = formText(formData, "title")

  return artworkMutationSchema.parse({
    availability: formText(formData, "availability"),
    category: formText(formData, "category"),
    description: formText(formData, "description"),
    displayedPieceDimensions:
      formText(formData, "displayedPieceDimensions") || null,
    displayOrder: formText(formData, "displayOrder"),
    featured: formCheckbox(formData, "featured"),
    hasImage: options.hasImage,
    mediumFormat: formText(formData, "mediumFormat") || null,
    priceAmount: formText(formData, "priceAmount"),
    pricingMode: formText(formData, "pricingMode"),
    primaryImageAlt: formText(formData, "primaryImageAlt") || null,
    published: formCheckbox(formData, "published"),
    slug: normalizeArtworkSlug(title),
    title,
  })
}

function parseArtworkRequestOptions(
  formData: FormData
): ArtworkRequestOptionsInput {
  const availableSizesEnabled = formCheckbox(
    formData,
    "availableSizesEnabled"
  )
  const framingEnabled = formCheckbox(formData, "framingEnabled")

  return artworkRequestOptionsSchema.parse({
    askQuantity: formCheckbox(formData, "askQuantity"),
    availableSizes: availableSizesEnabled
      ? formOptionValues(formData, "availableSizes")
      : [],
    availableSizesEnabled,
    framingEnabled,
    framingOptions: framingEnabled
      ? formOptionValues(formData, "framingOptions")
      : [],
  })
}

function parseArtworkImageAlt(formData: FormData): ArtworkImageAltInput {
  return artworkImageAltSchema.parse(formText(formData, "altText") || null)
}

export {
  parseArtworkImageAlt,
  parseArtworkMutation,
  parseArtworkRequestOptions,
}
