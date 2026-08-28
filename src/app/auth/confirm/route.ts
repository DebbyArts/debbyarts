import type { EmailOtpType } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

import {
  getAdminEmail,
  normalizeEmail,
  safeAdminRedirect,
} from "@/shared/auth/config"
import { createSupabaseServerClient } from "@/shared/auth/supabase-server"

const EMAIL_OTP_TYPES = new Set<EmailOtpType>([
  "email",
  "email_change",
  "invite",
  "magiclink",
  "recovery",
  "signup",
])

async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const code = request.nextUrl.searchParams.get("code")
  const tokenHash = request.nextUrl.searchParams.get("token_hash")
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null
  const next = safeAdminRedirect(request.nextUrl.searchParams.get("next"))
  let verified = false

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    verified = !error
  } else if (tokenHash && type && EMAIL_OTP_TYPES.has(type)) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    })
    verified = !error
  }

  if (verified) {
    const { data, error } = await supabase.auth.getClaims()
    const email = data?.claims?.email
    verified =
      !error &&
      typeof email === "string" &&
      normalizeEmail(email) === getAdminEmail()
  }

  if (!verified) {
    await supabase.auth.signOut({ scope: "local" })
    return NextResponse.redirect(
      new URL("/admin/login?error=invalid", request.url)
    )
  }

  return NextResponse.redirect(new URL(next, request.url))
}

export { GET }
