import sharp from "sharp"
import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  assertOwnedImagePath,
  ImageStorageError,
  ImageValidationError,
  immutableImagePath,
  validateImageFile,
} from "@/server/storage/image-storage"

describe("catalogue image safety", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET", "catalogue-media")
  })

  it("decodes accepted content and returns intrinsic dimensions", async () => {
    const buffer = await sharp({
      create: {
        width: 640,
        height: 480,
        channels: 3,
        background: "#cf2e78",
      },
    })
      .webp()
      .toBuffer()
    const file = new File([buffer], "misleading.jpg", { type: "image/jpeg" })

    await expect(validateImageFile(file)).resolves.toMatchObject({
      contentType: "image/webp",
      extension: "webp",
      height: 480,
      width: 640,
    })
  })

  it("rejects undecodable content and undersized images", async () => {
    await expect(
      validateImageFile(new File(["not an image"], "fake.png"))
    ).rejects.toBeInstanceOf(ImageValidationError)

    const tiny = await sharp({
      create: { width: 20, height: 20, channels: 3, background: "#fff" },
    })
      .png()
      .toBuffer()
    await expect(
      validateImageFile(new File([tiny], "tiny.png"))
    ).rejects.toBeInstanceOf(ImageValidationError)
  })

  it("rejects an image whose header parses but whose pixels cannot fully decode", async () => {
    const jpeg = await sharp({
      create: {
        width: 640,
        height: 480,
        channels: 3,
        background: "#cf2e78",
      },
    })
      .jpeg()
      .toBuffer()
    const truncated = jpeg.subarray(0, jpeg.length - 100)

    await expect(
      validateImageFile(new File([truncated], "truncated.jpg"))
    ).rejects.toBeInstanceOf(ImageValidationError)
  })

  it("generates immutable owner-scoped paths and blocks arbitrary deletion", () => {
    const path = immutableImagePath("abc-123", "artwork", "jpg")
    expect(path).toMatch(/^abc-123\/artwork\/[0-9a-f-]+\.jpg$/)
    expect(() => assertOwnedImagePath(path, "abc-123", "artwork")).not.toThrow()
    expect(() =>
      assertOwnedImagePath("someone-else/artwork/file.jpg", "abc-123", "artwork")
    ).toThrow(ImageStorageError)
    expect(() =>
      assertOwnedImagePath(
        "seed/artwork/leopard-painting/additional-01.webp",
        "abc-123",
        "artwork"
      )
    ).not.toThrow()
    expect(() =>
      assertOwnedImagePath(
        "seed/artwork/leopard-painting/additional-08.webp",
        "abc-123",
        "artwork"
      )
    ).toThrow(ImageStorageError)
  })
})
