import { afterEach, describe, expect, it, vi } from "vitest"

import { getSupabaseStorageAdminConfig } from "@/shared/supabase/config"

afterEach(() => {
  vi.unstubAllEnvs()
})

describe("Supabase configuration", () => {
  it("keeps privileged Storage configuration explicit", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co")
    vi.stubEnv("SUPABASE_SECRET_KEY", "test-secret")

    expect(getSupabaseStorageAdminConfig()).toEqual({
      secretKey: "test-secret",
      url: "https://example.supabase.co",
    })
  })
})
