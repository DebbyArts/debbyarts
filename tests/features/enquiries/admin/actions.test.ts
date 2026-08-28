import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  enquiryUpdate: vi.fn(),
  requireAdmin: vi.fn(),
  revalidatePath: vi.fn(),
}))

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }))
vi.mock("@/shared/auth/authorize", () => ({ requireAdmin: mocks.requireAdmin }))
vi.mock("@/db/client", () => ({
  prisma: { enquiry: { update: mocks.enquiryUpdate } },
}))

import { updateEnquiryStatusAction } from "@/features/enquiries/actions/update-enquiry-status.admin.action"

describe("Enquiry Admin action boundary", () => {
  beforeEach(() => {
    Object.values(mocks).forEach((mock) => mock.mockReset())
    mocks.requireAdmin.mockResolvedValue({
      email: "owner@example.com",
      id: "owner-id",
    })
    mocks.enquiryUpdate.mockResolvedValue({ id: "enquiry-1" })
  })

  it("authorizes and validates before changing an enquiry status", async () => {
    await updateEnquiryStatusAction("enquiry-1", "CONTACTED")

    expect(mocks.requireAdmin).toHaveBeenCalledOnce()
    expect(mocks.enquiryUpdate).toHaveBeenCalledWith({
      where: { id: "enquiry-1" },
      data: { status: "CONTACTED" },
    })
  })

  it("stops before database access when authorization fails", async () => {
    mocks.requireAdmin.mockRejectedValue(new Error("unauthorized"))

    await expect(
      updateEnquiryStatusAction("enquiry-1", "RESOLVED")
    ).rejects.toThrow("unauthorized")
    expect(mocks.enquiryUpdate).not.toHaveBeenCalled()
  })

  it("rejects an invalid state without touching the database", async () => {
    await expect(
      updateEnquiryStatusAction("enquiry-1", "ARCHIVED")
    ).rejects.toThrow("Invalid enquiry status.")
    expect(mocks.enquiryUpdate).not.toHaveBeenCalled()
  })
})
