import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const signInWithOtp = vi.fn()

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers({ origin: "http://127.0.0.1:3000" })),
}))

vi.mock("@/server/auth/supabase-server", () => ({
  createSupabaseServerClient: vi.fn(async () => ({
    auth: { signInWithOtp },
  })),
}))

import {
  requestMagicLinkAction,
} from "@/features/admin-auth/actions"
import { INITIAL_LOGIN_STATE } from "@/features/admin-auth/state"

describe("passwordless owner login", () => {
  beforeEach(() => {
    vi.stubEnv("SUPABASE_ADMIN_EMAIL", "owner@example.com")
    signInWithOtp.mockReset()
    signInWithOtp.mockResolvedValue({ error: null })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("does not call Supabase for a wrong email and keeps the response generic", async () => {
    const formData = new FormData()
    formData.set("email", "other@example.com")
    const result = await requestMagicLinkAction(INITIAL_LOGIN_STATE, formData)

    expect(result.status).toBe("sent")
    expect(signInWithOtp).not.toHaveBeenCalled()
  })

  it("disables sign-up and constrains the callback for the allowed email", async () => {
    const formData = new FormData()
    formData.set("email", " OWNER@example.com ")
    formData.set("next", "/admin/enquiries")
    await requestMagicLinkAction(INITIAL_LOGIN_STATE, formData)

    expect(signInWithOtp).toHaveBeenCalledWith({
      email: "owner@example.com",
      options: {
        emailRedirectTo:
          "http://127.0.0.1:3000/auth/confirm?next=%2Fadmin%2Fenquiries",
        shouldCreateUser: false,
      },
    })
  })
})
