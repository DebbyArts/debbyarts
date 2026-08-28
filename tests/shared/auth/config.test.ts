import { afterEach, describe, expect, it, vi } from "vitest"

import {
  getAdminEmail,
  getSupabaseStorageAdminConfig,
  normalizeEmail,
  safeAdminRedirect,
} from "@/shared/auth/config"

afterEach(() => {
  vi.unstubAllEnvs()
})

describe("Admin auth configuration", () => {
  it("normalizes the configured owner email", () => {
    vi.stubEnv("SUPABASE_ADMIN_EMAIL", "  Owner@Example.COM ")
    expect(getAdminEmail()).toBe("owner@example.com")
    expect(normalizeEmail(" OWNER@example.com ")).toBe("owner@example.com")
  })

  it("allows only internal Admin redirect destinations", () => {
    expect(safeAdminRedirect("/admin/enquiries/abc")).toBe(
      "/admin/enquiries/abc"
    )
    expect(safeAdminRedirect("https://evil.example/admin")).toBe(
      "/admin/artwork"
    )
    expect(safeAdminRedirect("//evil.example")).toBe("/admin/artwork")
    expect(safeAdminRedirect("/%E0%A4%A")).toBe("/admin/artwork")
  })

  it("keeps privileged Storage configuration server-only and explicit", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co")
    vi.stubEnv("SUPABASE_SECRET_KEY", "test-secret")

    expect(getSupabaseStorageAdminConfig()).toEqual({
      secretKey: "test-secret",
      url: "https://example.supabase.co",
    })
  })
})
