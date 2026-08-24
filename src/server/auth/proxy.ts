import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import {
  getAdminEmail,
  getSupabasePublicConfig,
  normalizeEmail,
  safeAdminRedirect,
} from "@/server/auth/config"

async function refreshAdminSession(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isLogin = path === "/admin/login"
  const isAuthCallback = path === "/auth/confirm"
  let response = NextResponse.next({ request })
  let publishableKey: string
  let url: string

  try {
    const config = getSupabasePublicConfig()
    publishableKey = config.publishableKey
    url = config.url
  } catch {
    if (isLogin) {
      response.headers.set("Cache-Control", "private, no-store")
      return response
    }

    return NextResponse.redirect(
      new URL("/admin/login?configuration=missing", request.url)
    )
  }
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, options, value }) =>
          response.cookies.set(name, value, options)
        )
        Object.entries(headers).forEach(([name, value]) =>
          response.headers.set(name, value)
        )
      },
    },
  })

  const { data, error } = await supabase.auth.getClaims()
  const claimedEmail = data?.claims?.email
  const isAdmin =
    !error &&
    typeof claimedEmail === "string" &&
    normalizeEmail(claimedEmail) === getAdminEmail()
  if (!isAdmin && !isLogin && !isAuthCallback) {
    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("next", safeAdminRedirect(path))
    return NextResponse.redirect(loginUrl)
  }

  if (isAdmin && isLogin) {
    return NextResponse.redirect(new URL(safeAdminRedirect(request.nextUrl.searchParams.get("next")), request.url))
  }

  response.headers.set(
    "Cache-Control",
    "private, no-cache, no-store, must-revalidate, max-age=0"
  )
  return response
}

export { refreshAdminSession }
