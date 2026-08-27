type RequestArtworkOption = {
  askQuantity: boolean
  availableSizes: string[]
  categoryLabel: string
  framingEnabled: boolean
  framingOptions: string[]
  id: string
  imageAlt: string
  imageSrc: string | null
  slug: string
  title: string
}

type RequestServiceOption = {
  askColour: boolean
  askDesignReadiness: boolean
  askFinish: boolean
  askMaterial: boolean
  askQuantity: boolean
  askSizeFormat: boolean
  groupLabel: string
  id: string
  imageAlt: string
  imageSrc: string | null
  name: string
  sizeFormatOptions: string[]
  slug: string
}

export type { RequestArtworkOption, RequestServiceOption }
