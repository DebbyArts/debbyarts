import { fireEvent, render, screen } from "@testing-library/react"
import { beforeAll, describe, expect, it, vi } from "vitest"

vi.mock("@/features/artwork/components/ArtworkMedia", () => ({
  ArtworkMedia: ({ alt, src }: { alt: string; src: string | null }) => (
    <div role="img" aria-label={alt} data-src={src ?? ""} />
  ),
}))

import { ArtworkLightbox } from "@/features/artwork/components/ArtworkLightbox"
import type { ArtworkProjection } from "@/features/artwork/types"

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "")
  }
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute("open")
  }
})

const artwork: ArtworkProjection = {
  slug: "blue-horse",
  title: "Blue Horse",
  description: "A blue horse study.",
  category: "PAINTING",
  mediumFormat: null,
  displayedPieceDimensions: null,
  availability: "AVAILABLE",
  gallery: [
    {
      alt: "Blue horse cover image",
      height: 1200,
      id: "cover",
      src: "https://example.test/cover.jpg",
      width: 800,
    },
    {
      alt: "Blue horse detail image",
      height: 600,
      id: "detail-1",
      src: "https://example.test/detail.jpg",
      width: 900,
    },
  ],
  imageAlt: "Blue horse cover image",
  imageHeight: 1200,
  imageSrc: "https://example.test/cover.jpg",
  imageWidth: 800,
  pricingMode: "NONE",
  priceAmount: null,
  categoryLabel: "Paintings",
  categoryItemLabel: "Painting",
  availabilityLabel: "Available",
  priceLabel: "Price on request",
  requestHref: "/request?artwork=blue-horse",
}

describe("ArtworkLightbox gallery navigation", () => {
  it("keeps image controls distinct from artwork navigation and exposes selected thumbnails", () => {
    const onSelect = vi.fn()
    const openerRef = { current: null }

    render(
      <ArtworkLightbox
        artworks={[artwork, { ...artwork, slug: "red-horse", title: "Red Horse" }]}
        onClose={vi.fn()}
        onSelect={onSelect}
        openerRef={openerRef}
        selectedIndex={0}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "View next image" }))
    expect(
      screen.getByRole("button", { name: "View image 2 of 2" }).getAttribute("aria-pressed")
    ).toBe("true")

    fireEvent.keyDown(screen.getByRole("dialog"), {
      altKey: true,
      key: "ArrowRight",
    })
    expect(onSelect).toHaveBeenCalledWith(1)
    expect(screen.getByText("Next artwork")).toBeTruthy()
  })
})
