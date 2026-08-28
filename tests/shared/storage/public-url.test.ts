import { afterEach, describe, expect, test, vi } from "vitest"

import { resolvePublicStorageObjectUrl } from "@/shared/storage/public-url"

afterEach(() => {
  vi.unstubAllEnvs()
})

describe("resolvePublicStorageObjectUrl", () => {
  test("builds encoded public URLs for hosted and approved local Supabase projects", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://debbyarts.supabase.co")

    expect(resolvePublicStorageObjectUrl("artwork/blue horse.jpg")).toBe(
      "https://debbyarts.supabase.co/storage/v1/object/public/catalogue-media/artwork/blue%20horse.jpg"
    )

    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://localhost:54321")

    expect(resolvePublicStorageObjectUrl("service/custom shirt.jpg")).toBe(
      "http://localhost:54321/storage/v1/object/public/catalogue-media/service/custom%20shirt.jpg"
    )
  })

  test("fails safely for missing configuration, unapproved origins, and malformed paths", () => {
    expect(resolvePublicStorageObjectUrl("artwork/blue-horse.jpg")).toBeNull()

    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://images.example.com")

    expect(resolvePublicStorageObjectUrl("artwork/blue-horse.jpg")).toBeNull()

    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321")

    expect(resolvePublicStorageObjectUrl("../blue-horse.jpg")).toBeNull()
    expect(resolvePublicStorageObjectUrl("artwork//blue-horse.jpg")).toBeNull()
    expect(resolvePublicStorageObjectUrl("/artwork/blue-horse.jpg")).toBeNull()
  })
})
