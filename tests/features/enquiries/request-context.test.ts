import { describe, expect, test } from "vitest"

import {
  getEnabledDetailFields,
  getRequestSteps,
  parseRequestContext,
} from "@/features/enquiries/request-context"
import type {
  RequestArtworkOption,
  RequestServiceOption,
} from "@/features/enquiries/request-types"

const artwork: RequestArtworkOption = {
  id: "artwork-1",
  slug: "horses",
  title: "Horses",
  categoryLabel: "Painting",
  imageSrc: null,
  imageAlt: "Horses",
  availableSizes: ["A3", "A2"],
  framingEnabled: true,
  framingOptions: ["Black", "Natural"],
  askQuantity: true,
}

const service: RequestServiceOption = {
  id: "service-1",
  slug: "custom-clothing",
  name: "Custom clothing",
  groupLabel: "Personalised Products",
  imageSrc: null,
  imageAlt: "Custom clothing",
  askQuantity: true,
  askSizeFormat: true,
  sizeFormatOptions: ["Adult", "Child"],
  askDesignReadiness: true,
  askColour: true,
  askMaterial: false,
  askFinish: true,
}

describe("request URL context", () => {
  test("parses default, artwork, service, and broad commission entry", () => {
    expect(parseRequestContext({})).toEqual({ status: "valid", mode: "default" })
    expect(parseRequestContext({ artwork: "horses" })).toEqual({
      status: "valid",
      mode: "artwork",
      slug: "horses",
    })
    expect(parseRequestContext({ service: "custom-clothing" })).toEqual({
      status: "valid",
      mode: "service",
      slug: "custom-clothing",
    })
    expect(parseRequestContext({ type: "art-commission" })).toEqual({
      status: "valid",
      mode: "art-commission",
    })
  })

  test("rejects duplicate, conflicting, empty, and unknown context", () => {
    expect(parseRequestContext({ artwork: ["horses", "horses"] }).status).toBe(
      "invalid"
    )
    expect(
      parseRequestContext({ artwork: "horses", service: "shirts" }).status
    ).toBe("invalid")
    expect(parseRequestContext({ service: "" }).status).toBe("invalid")
    expect(parseRequestContext({ type: "custom-mode" }).status).toBe("invalid")
  })
})

describe("request flow derivation", () => {
  test("compresses known context to details, delivery, and contact", () => {
    expect(getRequestSteps(false)).toEqual([
      "interest",
      "item",
      "details",
      "delivery",
      "contact",
    ])
    expect(getRequestSteps(true)).toEqual(["details", "delivery", "contact"])
  })

  test("derives only fields enabled by the selected record", () => {
    expect(getEnabledDetailFields({ kind: "ARTWORK", record: artwork })).toEqual([
      "sizeFormat",
      "framing",
      "quantity",
    ])
    expect(getEnabledDetailFields({ kind: "SERVICE", record: service })).toEqual([
      "quantity",
      "sizeFormat",
      "designReadiness",
      "colour",
      "finish",
    ])
    expect(getEnabledDetailFields(null)).toEqual([])
  })
})
