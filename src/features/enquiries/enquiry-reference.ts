import { randomBytes } from "node:crypto"

function generateEnquiryReference(entropy: Uint8Array = randomBytes(5)) {
  const suffix = Array.from(entropy)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()

  return `DAP-${suffix}`
}

export { generateEnquiryReference }
