import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"

import { getAdminEmail, normalizeEmail } from "@/server/auth/config"
import { createSupabaseServerClient } from "@/server/auth/supabase-server"

class AdminAuthorizationError extends Error {
  constructor() {
    super("Owner authorization is required.")
    this.name = "AdminAuthorizationError"
  }
}

type VerifiedAdmin = {
  email: string
  id: string
  supabase: SupabaseClient
}

async function getVerifiedAdmin(): Promise<VerifiedAdmin | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.getClaims()
  const email = data?.claims?.email
  const id = data?.claims?.sub

  if (
    error ||
    typeof email !== "string" ||
    typeof id !== "string" ||
    normalizeEmail(email) !== getAdminEmail()
  ) {
    return null
  }

  return { email: normalizeEmail(email), id, supabase }
}

async function requireAdmin() {
  const admin = await getVerifiedAdmin()

  if (!admin) {
    throw new AdminAuthorizationError()
  }

  return admin
}

export {
  AdminAuthorizationError,
  getVerifiedAdmin,
  requireAdmin,
  type VerifiedAdmin,
}
