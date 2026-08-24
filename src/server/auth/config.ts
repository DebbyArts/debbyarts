import "server-only"

const DEFAULT_ADMIN_PATH = "/admin/artwork"

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function getAdminEmail() {
  const value = process.env.SUPABASE_ADMIN_EMAIL

  if (!value) {
    throw new Error("SUPABASE_ADMIN_EMAIL is not configured.")
  }

  return normalizeEmail(value)
}

function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !publishableKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be configured."
    )
  }

  return { publishableKey, url }
}

function safeAdminRedirect(value: string | null | undefined) {
  if (!value) return DEFAULT_ADMIN_PATH

  try {
    const decoded = decodeURIComponent(value)
    return decoded === "/admin" || decoded.startsWith("/admin/")
      ? decoded
      : DEFAULT_ADMIN_PATH
  } catch {
    return DEFAULT_ADMIN_PATH
  }
}

export {
  DEFAULT_ADMIN_PATH,
  getAdminEmail,
  getSupabasePublicConfig,
  normalizeEmail,
  safeAdminRedirect,
}
