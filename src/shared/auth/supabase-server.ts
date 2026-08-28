import "server-only"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import { getSupabasePublicConfig } from "@/shared/supabase/config"

async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  const { publishableKey, url } = getSupabasePublicConfig()

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, options, value }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Server Components cannot write cookies. The request Proxy refreshes
          // sessions before rendering; Actions and Route Handlers can write.
        }
      },
    },
  })
}

export { createSupabaseServerClient }
