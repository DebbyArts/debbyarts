import { describe, expect, it } from "vitest"

import { PUBLISHED_ARTWORK_QUERY } from "@/features/artwork/repositories/artwork.repository"

describe("Artwork repository queries", () => {
  it("keeps the public catalogue published-only with stable image ordering", () => {
    expect(PUBLISHED_ARTWORK_QUERY.where).toEqual({ published: true })
    expect(PUBLISHED_ARTWORK_QUERY.orderBy).toEqual([
      { displayOrder: "asc" },
      { createdAt: "asc" },
      { id: "asc" },
    ])
    expect(PUBLISHED_ARTWORK_QUERY.select.additionalImages).toMatchObject({
      orderBy: { displayOrder: "asc" },
    })
  })
})
