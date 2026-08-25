import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  deleteCatalogueImage: vi.fn(),
  redirect: vi.fn(),
  requireAdmin: vi.fn(),
  revalidatePath: vi.fn(),
  serviceCreate: vi.fn(),
  serviceDelete: vi.fn(),
  serviceFindUnique: vi.fn(),
  serviceUpdate: vi.fn(),
  uploadCatalogueImage: vi.fn(),
}))

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }))
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }))
vi.mock("@/server/auth/authorize", () => ({ requireAdmin: mocks.requireAdmin }))
vi.mock("@/db/client", () => ({
  prisma: {
    service: {
      create: mocks.serviceCreate,
      delete: mocks.serviceDelete,
      findUnique: mocks.serviceFindUnique,
      update: mocks.serviceUpdate,
    },
  },
}))
vi.mock("@/server/storage/image-storage", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/server/storage/image-storage")>()),
  deleteCatalogueImage: mocks.deleteCatalogueImage,
  uploadCatalogueImage: mocks.uploadCatalogueImage,
}))

import {
  deleteServiceAction,
  saveServiceAction,
  saveServiceOptionsAction,
  unpublishServiceAction,
} from "@/features/services/admin/actions"
import { INITIAL_SERVICE_ACTION_STATE } from "@/features/services/admin/state"

const admin = { email: "owner@example.com", id: "owner-id" }
const existingService = {
  id: "service-1",
  primaryImagePath: "owner-id/service/old-image.jpg",
}

function serviceForm() {
  const formData = new FormData()
  formData.set("name", "Custom T-shirts")
  formData.set("description", "Printed clothing service.")
  formData.set("group", "PERSONALISED_PRODUCTS")
  formData.set("pricingMode", "NONE")
  formData.set("displayOrder", "0")
  formData.set(
    "primaryImage",
    new File(["image"], "service.jpg", { type: "image/jpeg" })
  )
  return formData
}

describe("Service Admin action boundaries", () => {
  beforeEach(() => {
    Object.values(mocks).forEach((mock) => mock.mockReset())
    mocks.requireAdmin.mockResolvedValue(admin)
    mocks.serviceFindUnique.mockResolvedValue(existingService)
    mocks.serviceCreate.mockResolvedValue({ id: "created-service" })
    mocks.serviceUpdate.mockResolvedValue(existingService)
    mocks.serviceDelete.mockResolvedValue(existingService)
    mocks.uploadCatalogueImage.mockResolvedValue({
      contentType: "image/jpeg",
      extension: "jpg",
      height: 640,
      path: "owner-id/service/new-image.jpg",
      width: 800,
    })
    mocks.deleteCatalogueImage.mockResolvedValue(undefined)
    mocks.redirect.mockImplementation((destination: string) => {
      throw new Error(`NEXT_REDIRECT:${destination}`)
    })
  })

  it("authorizes before editing and deletes the old image only after the database update", async () => {
    const result = await saveServiceAction(
      existingService.id,
      INITIAL_SERVICE_ACTION_STATE,
      serviceForm()
    )

    expect(result.status).toBe("success")
    expect(mocks.requireAdmin).toHaveBeenCalledOnce()
    expect(mocks.uploadCatalogueImage.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.serviceUpdate.mock.invocationCallOrder[0]
    )
    expect(mocks.serviceUpdate.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.deleteCatalogueImage.mock.invocationCallOrder[0]
    )
  })

  it("reports delete cleanup failure as an explicit partial success", async () => {
    mocks.deleteCatalogueImage.mockRejectedValue(new Error("storage unavailable"))

    await expect(deleteServiceAction(existingService.id)).rejects.toThrow(
      "NEXT_REDIRECT:/admin/services?deleted=1&cleanup=owner-id%2Fservice%2Fold-image.jpg"
    )
    expect(mocks.serviceDelete.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.deleteCatalogueImage.mock.invocationCallOrder[0]
    )
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/services")
  })

  it("cleans up a new upload when its database update fails", async () => {
    mocks.serviceUpdate.mockRejectedValue(new Error("database unavailable"))

    const result = await saveServiceAction(
      existingService.id,
      INITIAL_SERVICE_ACTION_STATE,
      serviceForm()
    )

    expect(result.status).toBe("error")
    expect(mocks.deleteCatalogueImage).toHaveBeenCalledWith(
      admin,
      "service",
      "owner-id/service/new-image.jpg"
    )
  })

  it("creates a new record only after authorization and upload", async () => {
    const result = await saveServiceAction(
      null,
      INITIAL_SERVICE_ACTION_STATE,
      serviceForm()
    )

    expect(result.status).toBe("success")
    expect(mocks.requireAdmin.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.uploadCatalogueImage.mock.invocationCallOrder[0]
    )
    expect(mocks.uploadCatalogueImage.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.serviceCreate.mock.invocationCallOrder[0]
    )
  })

  it("authorizes publication and request-option mutations", async () => {
    const options = new FormData()
    options.set("askSizeFormat", "on")
    options.set("sizeFormatOptions", "A4, A3")

    await saveServiceOptionsAction(
      existingService.id,
      INITIAL_SERVICE_ACTION_STATE,
      options
    )
    await unpublishServiceAction(existingService.id)

    expect(mocks.requireAdmin).toHaveBeenCalledTimes(2)
    expect(mocks.serviceUpdate).toHaveBeenCalledWith({
      where: { id: existingService.id },
      data: {
        askColour: false,
        askDesignReadiness: false,
        askFinish: false,
        askMaterial: false,
        askQuantity: false,
        askSizeFormat: true,
        sizeFormatOptions: ["A4", "A3"],
      },
    })
    expect(mocks.serviceUpdate).toHaveBeenCalledWith({
      where: { id: existingService.id },
      data: { published: false },
    })
  })

  it("stops every mutation before database or Storage access when authorization fails", async () => {
    mocks.requireAdmin.mockRejectedValue(new Error("unauthorized"))
    const options = new FormData()

    await expect(
      saveServiceAction(
        existingService.id,
        INITIAL_SERVICE_ACTION_STATE,
        serviceForm()
      )
    ).rejects.toThrow("unauthorized")
    await expect(
      saveServiceOptionsAction(
        existingService.id,
        INITIAL_SERVICE_ACTION_STATE,
        options
      )
    ).rejects.toThrow("unauthorized")
    await expect(unpublishServiceAction(existingService.id)).rejects.toThrow(
      "unauthorized"
    )
    await expect(deleteServiceAction(existingService.id)).rejects.toThrow(
      "unauthorized"
    )

    expect(mocks.serviceFindUnique).not.toHaveBeenCalled()
    expect(mocks.serviceCreate).not.toHaveBeenCalled()
    expect(mocks.serviceUpdate).not.toHaveBeenCalled()
    expect(mocks.serviceDelete).not.toHaveBeenCalled()
    expect(mocks.uploadCatalogueImage).not.toHaveBeenCalled()
    expect(mocks.deleteCatalogueImage).not.toHaveBeenCalled()
  })
})
