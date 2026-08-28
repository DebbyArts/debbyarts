import { CATALOGUE_MEDIA_BUCKET } from "@/shared/storage/constants"

const LOCAL_SUPABASE_STORAGE_ORIGINS = new Set([
  "http://127.0.0.1:54321",
  "http://localhost:54321",
])

function getSafePathSegments(value: string | null | undefined) {
  const path = value?.trim()

  if (!path) return null

  const segments = path.split("/")

  return segments.some(
    (segment) =>
      !segment || segment === "." || segment === ".." || segment.includes("\0")
  )
    ? null
    : segments
}

function isApprovedSupabaseProjectUrl(url: URL) {
  if (LOCAL_SUPABASE_STORAGE_ORIGINS.has(url.origin)) {
    return true
  }

  return url.protocol === "https:" && url.hostname.endsWith(".supabase.co")
}

function resolvePublicStorageObjectUrl(
  objectPath: string | null | undefined
): string | null {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const objectPathSegments = getSafePathSegments(objectPath)

  if (!projectUrl || !objectPathSegments) {
    return null
  }

  try {
    const publicObjectUrl = new URL(projectUrl)

    if (!isApprovedSupabaseProjectUrl(publicObjectUrl)) return null

    const encodedBucket = encodeURIComponent(CATALOGUE_MEDIA_BUCKET)
    const encodedPath = objectPathSegments.map(encodeURIComponent).join("/")

    publicObjectUrl.pathname = `/storage/v1/object/public/${encodedBucket}/${encodedPath}`
    publicObjectUrl.search = ""
    publicObjectUrl.hash = ""

    return publicObjectUrl.toString()
  } catch {
    return null
  }
}

export { resolvePublicStorageObjectUrl }
