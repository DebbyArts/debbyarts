import { beforeEach, describe, expect, it, vi } from "vitest"

const ArtworkMutationError = vi.hoisted(
  () => class ArtworkMutationError extends Error {}
)

const mocks = vi.hoisted(() => ({
  addArtworkImage: vi.fn(),
  removeArtworkImage: vi.fn(),
  requireAdmin: vi.fn(),
  revalidatePath: vi.fn(),
}))

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }))
vi.mock("@/shared/auth/authorize", () => ({ requireAdmin: mocks.requireAdmin }))
vi.mock("@/features/artwork/services/artwork.mutation.service", () => ({
  ArtworkMutationError,
  addArtworkImage: mocks.addArtworkImage,
  removeArtworkImage: mocks.removeArtworkImage,
}))

import { addArtworkImageAction } from "@/features/artwork/actions/add-artwork-image.admin.action"
import { removeArtworkImageAction } from "@/features/artwork/actions/remove-artwork-image.admin.action"

const admin = { email: "owner@example.com", id: "owner-id" }

describe("Artwork gallery image actions", () => {
  beforeEach(() => {
    Object.values(mocks).forEach((mock) => mock.mockReset())
    mocks.requireAdmin.mockResolvedValue(admin)
    mocks.addArtworkImage.mockResolvedValue({ status: "saved" })
    mocks.removeArtworkImage.mockResolvedValue({ status: "removed" })
  })

  it("authorizes, validates, and revalidates a one-image gallery upload", async () => {
    const formData = new FormData()
    const file = new File(["image"], "detail.jpg", { type: "image/jpeg" })
    formData.set("image", file)
    formData.set("altText", "Detail of the finished portrait")

    await expect(
      addArtworkImageAction("artwork-1", { message: "", status: "idle" }, formData)
    ).resolves.toEqual({ message: "Gallery image added.", status: "success" })

    expect(mocks.addArtworkImage).toHaveBeenCalledWith(
      admin,
      "artwork-1",
      file,
      "Detail of the finished portrait"
    )
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/art")
  })

  it("rejects an empty upload before the service boundary", async () => {
    const result = await addArtworkImageAction(
      "artwork-1",
      { message: "", status: "idle" },
      new FormData()
    )

    expect(result).toEqual({ message: "Choose an image to upload.", status: "error" })
    expect(mocks.addArtworkImage).not.toHaveBeenCalled()
  })

  it("returns expected Zod issues and hides unexpected service failures", async () => {
    const invalidAlt = new FormData()
    invalidAlt.set(
      "image",
      new File(["image"], "detail.jpg", { type: "image/jpeg" })
    )
    invalidAlt.set("altText", "x".repeat(181))

    await expect(
      addArtworkImageAction(
        "artwork-1",
        { message: "", status: "idle" },
        invalidAlt
      )
    ).resolves.toEqual({
      message: "Image alt text must be 180 characters or fewer.",
      status: "error",
    })
    expect(mocks.addArtworkImage).not.toHaveBeenCalled()

    mocks.addArtworkImage.mockRejectedValue(
      new Error("internal database connection detail")
    )
    const valid = new FormData()
    valid.set(
      "image",
      new File(["image"], "detail.jpg", { type: "image/jpeg" })
    )

    await expect(
      addArtworkImageAction(
        "artwork-1",
        { message: "", status: "idle" },
        valid
      )
    ).resolves.toEqual({
      message: "The gallery image could not be saved.",
      status: "error",
    })
  })

  it("keeps a post-database Storage cleanup warning explicit on removal", async () => {
    mocks.removeArtworkImage.mockResolvedValue({
      message: "The object needs manual Storage cleanup.",
      status: "cleanup-needed",
    })

    await expect(removeArtworkImageAction("artwork-1", "image-1")).resolves.toEqual({
      message: "The object needs manual Storage cleanup.",
      status: "warning",
    })
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/artwork")
  })
})
