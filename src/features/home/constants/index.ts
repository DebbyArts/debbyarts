const artworkCategoryLabels = {
  PAINTING: "Painting",
  PENCIL_PORTRAIT: "Pencil portrait",
  FRAMED_CUSTOM_ARTWORK: "Framed artwork",
  DIGITAL_ARTWORK: "Digital artwork",
} as const

const requestSteps = [
  ["Explore the relevant artwork or service.", "EXPLORE"],
  ["Choose the artwork or service you’re interested in.", "CHOOSE"],
  ["Add the few details Debby Art & Prints needs.", "ADD DETAILS"],
  ["Submit your request, then continue the conversation on WhatsApp.", "SUBMIT"],
] as const

const essentials = [
  { eyebrow: "SERVICE AREA", title: "LAGOS + NATIONWIDE", description: "Debby Art & Prints serves customers across Lagos and nationwide." },
  { eyebrow: "ORDERING", title: "DETAILS CONFIRMED WITH YOU", description: "Production details are confirmed for each request." },
  { eyebrow: "DELIVERY / PICKUP", title: "CONFIRMED PER REQUEST", description: "Final delivery or pickup details are discussed for the specific request." },
] as const

export { artworkCategoryLabels, essentials, requestSteps }
