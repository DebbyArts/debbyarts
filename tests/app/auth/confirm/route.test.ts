import { NextRequest } from "next/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { exchangeCodeForSession, getClaims, signOut, verifyOtp } = vi.hoisted(
  () => ({
    exchangeCodeForSession: vi.fn(),
    getClaims: vi.fn(),
    signOut: vi.fn(),
    verifyOtp: vi.fn(),
  })
)

vi.mock("@/server/auth/supabase-server", () => ({
  createSupabaseServerClient: vi.fn(async () => ({
    auth: { exchangeCodeForSession, getClaims, signOut, verifyOtp },
  })),
}))

import { GET } from "@/app/auth/confirm/route"

describe("passwordless callback", () => {
  beforeEach(() => {
    vi.stubEnv("SUPABASE_ADMIN_EMAIL", "owner@example.com")
    exchangeCodeForSession.mockReset()
    getClaims.mockReset()
    signOut.mockReset()
    verifyOtp.mockReset()
    exchangeCodeForSession.mockResolvedValue({ error: null })
    getClaims.mockResolvedValue({
      data: { claims: { email: "owner@example.com", sub: "owner-id" } },
      error: null,
    })
    signOut.mockResolvedValue({ error: null })
    verifyOtp.mockResolvedValue({ error: null })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("exchanges an approved code and uses only a safe Admin destination", async () => {
    const response = await GET(
      new NextRequest(
        "https://debbyarts.test/auth/confirm?code=one-time-code&next=https%3A%2F%2Fevil.test"
      )
    )

    expect(exchangeCodeForSession).toHaveBeenCalledWith("one-time-code")
    expect(response.headers.get("location")).toBe(
      "https://debbyarts.test/admin/artwork"
    )
    expect(signOut).not.toHaveBeenCalled()
  })

  it("verifies a token hash only for an allowed email OTP type", async () => {
    const response = await GET(
      new NextRequest(
        "https://debbyarts.test/auth/confirm?token_hash=hashed&type=magiclink&next=%2Fadmin%2Fservices"
      )
    )

    expect(verifyOtp).toHaveBeenCalledWith({
      token_hash: "hashed",
      type: "magiclink",
    })
    expect(response.headers.get("location")).toBe(
      "https://debbyarts.test/admin/services"
    )
  })

  it("clears a callback session whose verified claims have the wrong email", async () => {
    getClaims.mockResolvedValue({
      data: { claims: { email: "other@example.com", sub: "other-id" } },
      error: null,
    })

    const response = await GET(
      new NextRequest("https://debbyarts.test/auth/confirm?code=one-time-code")
    )

    expect(signOut).toHaveBeenCalledWith({ scope: "local" })
    expect(response.headers.get("location")).toBe(
      "https://debbyarts.test/admin/login?error=invalid"
    )
  })
})
