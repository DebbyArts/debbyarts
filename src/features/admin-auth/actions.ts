"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import {
  getAdminEmail,
  normalizeEmail,
  safeAdminRedirect,
} from "@/shared/auth/config"
import { requireAdmin } from "@/shared/auth/authorize"
import { createSupabaseServerClient } from "@/shared/auth/supabase-server"
import type { LoginActionState } from "@/features/admin-auth/state"

async function requestMagicLinkAction(
  _previousState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const enteredEmail = normalizeEmail(String(formData.get("email") ?? ""))
  const next = safeAdminRedirect(String(formData.get("next") ?? ""))

  if (!enteredEmail || !enteredEmail.includes("@")) {
    return {
      status: "error",
      message: "Enter a valid email address.",
    }
  }

  // Keep the response identical for disallowed and unprovisioned addresses.
  if (enteredEmail !== getAdminEmail()) {
    return {
      status: "sent",
      message: "If this address has owner access, a secure sign-in link is on its way.",
    }
  }

  const requestHeaders = await headers()
  const origin = requestHeaders.get("origin")

  if (!origin) {
    return {
      status: "error",
      message: "Sign-in is temporarily unavailable. Please try again.",
    }
  }

  const callbackUrl = new URL("/auth/confirm", origin)
  callbackUrl.searchParams.set("next", next)
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithOtp({
    email: enteredEmail,
    options: {
      emailRedirectTo: callbackUrl.toString(),
      shouldCreateUser: false,
    },
  })

  if (error) {
    return {
      status: "sent",
      message: "If this address has owner access, a secure sign-in link is on its way.",
    }
  }

  return {
    status: "sent",
    message: "If this address has owner access, a secure sign-in link is on its way.",
  }
}

async function signOutAction() {
  const { supabase } = await requireAdmin()
  await supabase.auth.signOut({ scope: "local" })
  redirect("/admin/login?signedOut=1")
}

export {
  requestMagicLinkAction,
  signOutAction,
}
