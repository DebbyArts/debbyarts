import { describe, expect, test, vi } from "vitest"

import {
  RequestContextUnavailableError,
  createEnquiry,
  type CreateEnquiryDependencies,
  type EnquiryWriteRecord,
} from "@/features/enquiries/create-enquiry"
import type {
  RequestDraft,
  RequestServiceOption,
} from "@/features/enquiries/request-types"

const NOW = new Date("2026-08-24T12:00:00.000Z")

const service: RequestServiceOption = {
  id: "service-1",
  slug: "custom-clothing",
  name: "Custom clothing",
  groupLabel: "Personalised Products",
  imageSrc: null,
  imageAlt: "Custom clothing",
  askQuantity: true,
  askSizeFormat: true,
  sizeFormatOptions: ["Adult"],
  askDesignReadiness: true,
  askColour: false,
  askMaterial: false,
  askFinish: false,
}

function draft(overrides: Partial<RequestDraft> = {}): RequestDraft {
  return {
    broadRequest: false,
    contextMode: "service",
    requestKind: "SERVICE",
    itemSlug: service.slug,
    quantity: "10",
    sizeFormat: "Adult",
    framing: "",
    designReadiness: "NEEDS_DESIGN_HELP",
    colour: "",
    material: "",
    finish: "",
    fulfilmentMethod: "PICKUP",
    location: "",
    preferredDate: "",
    customerName: "Ada",
    phoneWhatsApp: "08141234567",
    email: "",
    customerNote: "",
    ...overrides,
  }
}

function dependencies(overrides: Partial<CreateEnquiryDependencies> = {}) {
  const writes: EnquiryWriteRecord[] = []
  const deps: CreateEnquiryDependencies = {
    now: () => NOW,
    generateReference: () => "DAP-20260824-ABC123",
    findArtwork: vi.fn(async () => null),
    findService: vi.fn(async () => service),
    findDuplicate: vi.fn(async () => null),
    create: vi.fn(async (record) => {
      writes.push(record)
    }),
    ...overrides,
  }

  return { deps, writes }
}

describe("enquiry creation service", () => {
  test("persists the normalized enquiry before returning WhatsApp continuation", async () => {
    const { deps, writes } = dependencies()
    const result = await createEnquiry(
      draft(),
      "https://debby.example/request",
      deps
    )

    expect(writes).toHaveLength(1)
    expect(writes[0]).toMatchObject({
      reference: "DAP-20260824-ABC123",
      requestKind: "SERVICE",
      serviceId: "service-1",
      phoneWhatsApp: "+2348141234567",
      quantity: 10,
      whatsappSummary: expect.stringContaining("DAP-20260824-ABC123"),
    })
    expect(result).toMatchObject({
      duplicate: false,
      reference: "DAP-20260824-ABC123",
      whatsappUrl: expect.stringMatching(/^https:\/\/wa\.me\//),
    })
  })

  test("reuses a recent matching submission instead of creating a duplicate", async () => {
    const create = vi.fn(async () => undefined)
    const { deps } = dependencies({
      findDuplicate: vi.fn(async () => ({ reference: "DAP-EXISTING" })),
      create,
    })

    const result = await createEnquiry(draft(), "https://debby.example", deps)

    expect(result.duplicate).toBe(true)
    expect(result.reference).toBe("DAP-EXISTING")
    expect(result.whatsappUrl).toContain("DAP-EXISTING")
    expect(create).not.toHaveBeenCalled()
  })

  test("stops when a selected catalogue record is deleted or unpublished", async () => {
    const create = vi.fn(async () => undefined)
    const { deps } = dependencies({
      findService: vi.fn(async () => null),
      create,
    })

    await expect(
      createEnquiry(draft(), "https://debby.example", deps)
    ).rejects.toBeInstanceOf(RequestContextUnavailableError)
    expect(create).not.toHaveBeenCalled()
  })

  test("does not return or enable WhatsApp when persistence fails", async () => {
    const { deps } = dependencies({
      create: vi.fn(async () => {
        throw new Error("database unavailable")
      }),
    })

    await expect(
      createEnquiry(draft(), "https://debby.example", deps)
    ).rejects.toThrow("database unavailable")
  })

  test("retries a reference collision without duplicating the submission", async () => {
    const references = ["DAP-COLLISION", "DAP-UNIQUE"]
    const create = vi
      .fn<(record: EnquiryWriteRecord) => Promise<void>>()
      .mockRejectedValueOnce({ code: "P2002" })
      .mockResolvedValueOnce(undefined)
    const { deps } = dependencies({
      generateReference: () => references.shift() as string,
      create,
    })

    const result = await createEnquiry(draft(), "https://debby.example", deps)

    expect(create).toHaveBeenCalledTimes(2)
    expect(result.reference).toBe("DAP-UNIQUE")
  })

  test("persists a broad art commission with stable snapshots and no entity", async () => {
    const { deps, writes } = dependencies()
    const result = await createEnquiry(
      draft({
        broadRequest: true,
        contextMode: "art-commission",
        requestKind: "ARTWORK",
        itemSlug: "",
        quantity: "",
        sizeFormat: "",
        designReadiness: "",
        customerNote: "A family portrait commission.",
      }),
      "https://debby.example",
      deps
    )

    expect(writes[0]).toMatchObject({
      artworkId: null,
      serviceId: null,
      requestKind: "ARTWORK",
      itemNameSnapshot: "Custom art commission",
      itemSlugSnapshot: "art-commission",
    })
    expect(result.whatsappSummary).toContain("Custom art commission")
  })
})
