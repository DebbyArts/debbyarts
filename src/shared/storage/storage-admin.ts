import { createClient } from "@supabase/supabase-js"

import { getSupabaseStorageAdminConfig } from "@/shared/supabase-config"

function createStorageAdminClient() {
  const { secretKey, url } = getSupabaseStorageAdminConfig()

  return createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  })
}

export { createStorageAdminClient }
