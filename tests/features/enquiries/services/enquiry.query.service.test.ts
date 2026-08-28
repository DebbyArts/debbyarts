import { beforeEach, describe, expect, it, vi } from "vitest"

import type {
  RequestArtworkOption,
  RequestServiceOption,
} from "@/features/enquiries/types"

const mocks = vi.hoisted(() => ({
  getPublishedRequestCatalogue: vi.fn(),
}))

vi.mock("@/shared/request-catalogue", () => ({
  getPublishedRequestCatalogue: mocks.getPublishedRequestCatalogue,
}))

import { loadRequestPage } from "@/features/enquiries/services/enquiry.query.service"

const artwork: RequestArtworkOption = {
  askQuantity: true,
  availableSizes: ["A3"],
  categoryLabel: "Painting",
  framingEnabled: false,
  framingOptions: [],
  id: "artwork-1",
  imageAlt: "Horses",
  imageSrc: null,
  slug: "horses",
  title: "Horses",
}

const service: RequestServiceOption = {
  askColour: false,
  askDesignReadiness: false,
  askFinish: false,
  askMaterial: false,
  askQuantity: true,
  askSizeFormat: false,
  groupLabel: "Personalised Products",
  id: "service-1",
  imageAlt: "Custom clothing",
  imageSrc: null,
  materialOptions: [],
  name: "Custom clothing",
  sizeFormatOptions: [],
  slug: "custom-clothing",
}

describe("Enquiry request-page query service", () => {
  beforeEach(() => {
    mocks.getPublishedRequestCatalogue.mockReset()
    mocks.getPublishedRequestCatalogue.mockResolvedValue({
      artworks: [artwork],
      services: [service],
    })
  })

  it("loads the trusted selected record into the ready request context", async () => {
    await expect(
      loadRequestPage({ service: "custom-clothing" })
    ).resolves.toMatchObject({
      initialContext: {
        itemSlug: "custom-clothing",
        kind: "SERVICE",
        mode: "service",
      },
      status: "ready",
    })
  })

  it("rejects a selected record that is no longer in the published catalogue", async () => {
    await expect(
      loadRequestPage({ artwork: "unpublished-artwork" })
    ).resolves.toEqual({
      message:
        "That artwork is no longer available for requests. Choose another artwork or start a general request.",
      status: "invalid",
    })
  })

  it("loads the broad art-commission context with the full request catalogue", async () => {
    await expect(
      loadRequestPage({ type: "art-commission" })
    ).resolves.toMatchObject({
      artworks: [artwork],
      initialContext: {
        itemSlug: null,
        kind: "ARTWORK",
        mode: "art-commission",
      },
      services: [service],
      status: "ready",
    })
  })
})
