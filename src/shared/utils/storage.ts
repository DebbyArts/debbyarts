function resolvePublicArtworkImageUrl(
  objectPath: string | null
): string | null {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET

  if (!objectPath || !projectUrl || !bucket) return null

  const pathSegments = objectPath.split("/")

  if (
    pathSegments.some(
      (segment) => !segment || segment === "." || segment === ".."
    )
  ) {
    return null
  }

  try {
    const publicObjectUrl = new URL(projectUrl)

    if (!["http:", "https:"].includes(publicObjectUrl.protocol)) {
      return null
    }

    const encodedBucket = encodeURIComponent(bucket)
    const encodedPath = pathSegments.map(encodeURIComponent).join("/")

    publicObjectUrl.pathname = `/storage/v1/object/public/${encodedBucket}/${encodedPath}`
    publicObjectUrl.search = ""
    publicObjectUrl.hash = ""

    return publicObjectUrl.toString()
  } catch {
    return null
  }
}

export { resolvePublicArtworkImageUrl }
