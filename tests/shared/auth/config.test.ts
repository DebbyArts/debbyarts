import { afterEach, describe, expect, it, vi } from "vitest"

import {
  getAdminEmail,
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

})
