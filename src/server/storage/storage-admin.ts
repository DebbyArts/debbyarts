import { createClient } from "@supabase/supabase-js"

import { getSupabaseStorageAdminConfig } from "@/server/supabase-config"

const STORAGE_BUCKET = "catalogue-media"

function getStorageBucket() {
  const configured = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET

  if (configured !== STORAGE_BUCKET) {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET must be ${STORAGE_BUCKET}.`
    )
  }

  return STORAGE_BUCKET
}

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

export { createStorageAdminClient, getStorageBucket, STORAGE_BUCKET }
