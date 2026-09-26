import { createSocialImage } from "./metadata-images"

export const alt = "Debby Art & Prints — make it personal"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return createSocialImage()
}
