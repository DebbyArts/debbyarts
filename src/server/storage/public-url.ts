import "server-only"

function getPublicMediaUrl(path: string | null | undefined) {
  const baseUrl = process.env.PUBLIC_MEDIA_BASE_URL?.replace(/\/+$/, "")
  if (!baseUrl || !path) return null

  return `${baseUrl}/${path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`
}

export { getPublicMediaUrl }
