import { afterEach, describe, expect, it, vi } from "vitest"

const getClaims = vi.fn()

vi.mock("@/server/auth/supabase-server", () => ({
  createSupabaseServerClient: vi.fn(async () => ({ auth: { getClaims } })),
}))

import {
  AdminAuthorizationError,
  getVerifiedAdmin,
  requireAdmin,
} from "@/server/auth/authorize"

describe("verified Admin identity", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    getClaims.mockReset()
  })

  it("accepts verified claims for the normalized configured email", async () => {
    vi.stubEnv("SUPABASE_ADMIN_EMAIL", "owner@example.com")
    getClaims.mockResolvedValue({
      data: { claims: { email: "Owner@Example.com", sub: "user-123" } },
      error: null,
    })

    await expect(getVerifiedAdmin()).resolves.toMatchObject({
      email: "owner@example.com",
      id: "user-123",
    })
  })

  it("rejects wrong-email and expired/unverified claims", async () => {
    vi.stubEnv("SUPABASE_ADMIN_EMAIL", "owner@example.com")
    getClaims.mockResolvedValue({
      data: { claims: { email: "other@example.com", sub: "user-456" } },
      error: null,
    })
    await expect(requireAdmin()).rejects.toBeInstanceOf(AdminAuthorizationError)

    getClaims.mockResolvedValue({ data: null, error: new Error("expired") })
    await expect(requireAdmin()).rejects.toBeInstanceOf(AdminAuthorizationError)
  })
})
