import { NextRequest } from "next/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { createServerClient } = vi.hoisted(() => ({
  createServerClient: vi.fn(),
}))

type MockServerClientOptions = {
  cookies: {
    setAll: (
      cookies: {
        name: string
        options: Record<string, unknown>
        value: string
      }[],
      headers: Record<string, string>
    ) => void
  }
}

vi.mock("@supabase/ssr", () => ({ createServerClient }))

import { refreshAdminSession } from "@/server/auth/proxy"

describe("Admin Proxy session refresh", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co")
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "test-publishable")
    vi.stubEnv("SUPABASE_ADMIN_EMAIL", "owner@example.com")
    createServerClient.mockReset()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("preserves rotated cookies and no-store headers when an Admin login redirects", async () => {
    createServerClient.mockImplementation(
      (_url, _key, options: MockServerClientOptions) => ({
        auth: {
          getClaims: async () => {
            options.cookies.setAll(
              [
                {
                  name: "sb-session",
                  value: "rotated-token",
                  options: { httpOnly: true, path: "/", sameSite: "lax" },
                },
              ],
              { Expires: "0", Pragma: "no-cache" }
            )
            return {
              data: {
                claims: { email: "owner@example.com", sub: "owner-id" },
              },
              error: null,
            }
          },
        },
      })
    )

    const response = await refreshAdminSession(
      new NextRequest(
        "https://debbyarts.test/admin/login?next=%2Fadmin%2Fenquiries"
      )
    )

    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toBe(
      "https://debbyarts.test/admin/enquiries"
    )
    expect(response.cookies.get("sb-session")?.value).toBe("rotated-token")
    expect(response.headers.get("pragma")).toBe("no-cache")
    expect(response.headers.get("cache-control")).toContain("no-store")
  })

  it("preserves rotated cookies when an unauthorised deep link redirects", async () => {
    createServerClient.mockImplementation(
      (_url, _key, options: MockServerClientOptions) => ({
        auth: {
          getClaims: async () => {
            options.cookies.setAll(
              [
                {
                  name: "sb-session",
                  value: "expired-session",
                  options: { httpOnly: true, path: "/" },
                },
              ],
              { Pragma: "no-cache" }
            )
            return { data: null, error: new Error("expired") }
          },
        },
      })
    )

    const response = await refreshAdminSession(
      new NextRequest("https://debbyarts.test/admin/services/service-1")
    )

    expect(response.headers.get("location")).toBe(
      "https://debbyarts.test/admin/login?next=%2Fadmin%2Fservices%2Fservice-1"
    )
    expect(response.cookies.get("sb-session")?.value).toBe("expired-session")
  })
})
