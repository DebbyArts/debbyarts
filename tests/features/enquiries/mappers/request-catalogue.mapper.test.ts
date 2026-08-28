import { afterEach, describe, expect, it, vi } from "vitest"

import {
  mapToRequestArtworkOption,
  mapToRequestServiceOption,
  type RequestArtworkRecord,
  type RequestServiceRecord,
} from "@/features/enquiries/mappers/request-catalogue.mapper"

afterEach(() => vi.unstubAllEnvs())

describe("request catalogue mappers", () => {
  it("projects published artwork options with their request configuration", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co")

    const artwork = {
      id: "artwork-1",
      slug: "blue-horse",
      title: "Blue Horse",
      category: "PAINTING",
      primaryImagePath: "artwork/blue horse.jpg",
      primaryImageAlt: null,
      availableSizes: ["A3"],
      framingEnabled: true,
      framingOptions: ["Black"],
      askQuantity: true,
    } satisfies RequestArtworkRecord

    expect(mapToRequestArtworkOption(artwork)).toEqual({
      id: "artwork-1",
      slug: "blue-horse",
      title: "Blue Horse",
      categoryLabel: "Painting",
      imageSrc:
        "https://example.supabase.co/storage/v1/object/public/catalogue-media/artwork/blue%20horse.jpg",
      imageAlt: "Blue Horse, an artwork by Debby Art & Prints",
      availableSizes: ["A3"],
      framingEnabled: true,
      framingOptions: ["Black"],
      askQuantity: true,
    })
  })

  it("keeps service request image fallback and option settings intact", () => {
    const service = {
      id: "service-1",
      slug: "custom-clothing",
      name: "Custom Clothing",
      group: "PERSONALISED_PRODUCTS",
      primaryImagePath: "service/custom-clothing.jpg",
      primaryImageAlt: null,
      askQuantity: true,
      askSizeFormat: true,
      sizeFormatOptions: ["A4"],
      askDesignReadiness: true,
      askColour: true,
      askMaterial: true,
      materialOptions: ["Cotton"],
      askFinish: true,
    } satisfies RequestServiceRecord

    expect(mapToRequestServiceOption(service)).toMatchObject({
      groupLabel: "Personalised Products",
      imageSrc: null,
      imageAlt: "Image unavailable for Custom Clothing",
      askMaterial: true,
      materialOptions: ["Cotton"],
      sizeFormatOptions: ["A4"],
    })
  })
})
