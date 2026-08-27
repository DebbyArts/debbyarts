import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  artworkCreate: vi.fn(),
  artworkDelete: vi.fn(),
  artworkFindUnique: vi.fn(),
  artworkUpdate: vi.fn(),
  deleteCatalogueImage: vi.fn(),
  redirect: vi.fn(),
  requireAdmin: vi.fn(),
  revalidatePath: vi.fn(),
  uploadCatalogueImage: vi.fn(),
}))

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }))
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }))
vi.mock("@/server/auth/authorize", () => ({ requireAdmin: mocks.requireAdmin }))
vi.mock("@/db/client", () => ({
  prisma: {
    artwork: {
      create: mocks.artworkCreate,
      delete: mocks.artworkDelete,
      findUnique: mocks.artworkFindUnique,
      update: mocks.artworkUpdate,
    },
  },
}))
vi.mock("@/server/storage/image-storage", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/server/storage/image-storage")>()),
  deleteCatalogueImage: mocks.deleteCatalogueImage,
  uploadCatalogueImage: mocks.uploadCatalogueImage,
}))

import { deleteArtworkAction } from "@/features/artwork/actions/delete-artwork.admin.action"
import { saveArtworkOptionsAction } from "@/features/artwork/actions/save-artwork-options.admin.action"
import { saveArtworkAction } from "@/features/artwork/actions/save-artwork.admin.action"
import { unpublishArtworkAction } from "@/features/artwork/actions/unpublish-artwork.admin.action"
import { INITIAL_ARTWORK_ACTION_STATE } from "@/features/artwork/constants"

const admin = { email: "owner@example.com", id: "owner-id" }
const existingArtwork = {
  id: "artwork-1",
  primaryImagePath: "owner-id/artwork/old-image.jpg",
}

function artworkForm() {
  const formData = new FormData()
  formData.set("title", "Quiet Strength")
  formData.set("description", "A finished portrait.")
  formData.set("category", "PAINTING")
  formData.set("availability", "AVAILABLE")
  formData.set("pricingMode", "NONE")
  formData.set("displayOrder", "0")
  formData.set(
    "primaryImage",
    new File(["image"], "portrait.jpg", { type: "image/jpeg" })
  )
  return formData
}

describe("Artwork Admin action boundaries", () => {
  beforeEach(() => {
    Object.values(mocks).forEach((mock) => mock.mockReset())
    mocks.requireAdmin.mockResolvedValue(admin)
    mocks.artworkFindUnique.mockResolvedValue(existingArtwork)
    mocks.artworkCreate.mockResolvedValue({ id: "created-artwork" })
    mocks.artworkUpdate.mockResolvedValue(existingArtwork)
    mocks.artworkDelete.mockResolvedValue(existingArtwork)
    mocks.uploadCatalogueImage.mockResolvedValue({
      contentType: "image/jpeg",
      extension: "jpg",
      height: 640,
      path: "owner-id/artwork/new-image.jpg",
      width: 800,
    })
    mocks.deleteCatalogueImage.mockResolvedValue(undefined)
    mocks.redirect.mockImplementation((destination: string) => {
      throw new Error(`NEXT_REDIRECT:${destination}`)
    })
  })

  it("authorizes before editing and deletes the old image only after the database update", async () => {
    const result = await saveArtworkAction(
      existingArtwork.id,
      INITIAL_ARTWORK_ACTION_STATE,
      artworkForm()
    )

    expect(result.status).toBe("success")
    expect(mocks.requireAdmin).toHaveBeenCalledOnce()
    expect(mocks.uploadCatalogueImage.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.artworkUpdate.mock.invocationCallOrder[0]
    )
    expect(mocks.artworkUpdate.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.deleteCatalogueImage.mock.invocationCallOrder[0]
    )
    expect(mocks.deleteCatalogueImage).toHaveBeenCalledWith(
      admin,
      "artwork",
      existingArtwork.primaryImagePath
    )
  })

  it("cleans up a new upload when its database update fails", async () => {
    mocks.artworkUpdate.mockRejectedValue(new Error("database unavailable"))

    const result = await saveArtworkAction(
      existingArtwork.id,
      INITIAL_ARTWORK_ACTION_STATE,
      artworkForm()
    )

    expect(result.status).toBe("error")
    expect(mocks.deleteCatalogueImage).toHaveBeenCalledWith(
      admin,
      "artwork",
      "owner-id/artwork/new-image.jpg"
    )
  })

  it("returns the created record ID after authorization and upload", async () => {
    const result = await saveArtworkAction(
      null,
      INITIAL_ARTWORK_ACTION_STATE,
      artworkForm()
    )

    expect(result).toMatchObject({
      createdId: "created-artwork",
      status: "success",
    })
    expect(mocks.requireAdmin.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.uploadCatalogueImage.mock.invocationCallOrder[0]
    )
    expect(mocks.uploadCatalogueImage.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.artworkCreate.mock.invocationCallOrder[0]
    )
  })

  it("keeps a saved image-cleanup warning explicit", async () => {
    mocks.deleteCatalogueImage.mockRejectedValue(new Error("storage unavailable"))

    const result = await saveArtworkAction(
      existingArtwork.id,
      INITIAL_ARTWORK_ACTION_STATE,
      artworkForm()
    )

    expect(result).toMatchObject({
      message: "storage unavailable",
      status: "warning",
    })
    expect(result.createdId).toBeUndefined()
  })

  it("authorizes publication and request-option mutations", async () => {
    const options = new FormData()
    options.set("availableSizesEnabled", "on")
    options.set("availableSizes", "A4, A3")

    await saveArtworkOptionsAction(
      existingArtwork.id,
      INITIAL_ARTWORK_ACTION_STATE,
      options
    )
    await unpublishArtworkAction(existingArtwork.id)

    expect(mocks.requireAdmin).toHaveBeenCalledTimes(2)
    expect(mocks.artworkUpdate).toHaveBeenCalledWith({
      where: { id: existingArtwork.id },
      data: {
        askQuantity: false,
        availableSizes: ["A4", "A3"],
        framingEnabled: false,
        framingOptions: [],
      },
    })
    expect(mocks.artworkUpdate).toHaveBeenCalledWith({
      where: { id: existingArtwork.id },
      data: { published: false },
    })
  })

  it("reports delete cleanup failure as an explicit partial success", async () => {
    mocks.deleteCatalogueImage.mockRejectedValue(new Error("storage unavailable"))

    await expect(deleteArtworkAction(existingArtwork.id)).rejects.toThrow(
      "NEXT_REDIRECT:/admin/artwork?deleted=1&cleanup=owner-id%2Fartwork%2Fold-image.jpg"
    )
    expect(mocks.artworkDelete.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.deleteCatalogueImage.mock.invocationCallOrder[0]
    )
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/artwork")
  })

  it("stops every mutation before database access when authorization fails", async () => {
    mocks.requireAdmin.mockRejectedValue(new Error("unauthorized"))
    const options = new FormData()

    await expect(
      saveArtworkAction(
        existingArtwork.id,
        INITIAL_ARTWORK_ACTION_STATE,
        artworkForm()
      )
    ).rejects.toThrow("unauthorized")
    await expect(
      saveArtworkOptionsAction(
        existingArtwork.id,
        INITIAL_ARTWORK_ACTION_STATE,
        options
      )
    ).rejects.toThrow("unauthorized")
    await expect(unpublishArtworkAction(existingArtwork.id)).rejects.toThrow(
      "unauthorized"
    )
    await expect(deleteArtworkAction(existingArtwork.id)).rejects.toThrow(
      "unauthorized"
    )

    expect(mocks.artworkFindUnique).not.toHaveBeenCalled()
    expect(mocks.artworkCreate).not.toHaveBeenCalled()
    expect(mocks.artworkUpdate).not.toHaveBeenCalled()
    expect(mocks.artworkDelete).not.toHaveBeenCalled()
    expect(mocks.uploadCatalogueImage).not.toHaveBeenCalled()
    expect(mocks.deleteCatalogueImage).not.toHaveBeenCalled()
  })
})
