"use client"

import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"

function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen px-5 py-12 sm:px-8 lg:px-16">
      <ErrorState
        title="The owner workspace could not load"
        description="Nothing was changed. Try the request again; if it continues, check the server and Supabase configuration."
        action={
          <Button type="button" size="sm" variant="destructive" onClick={reset}>
            Try again
          </Button>
        }
      />
    </main>
  )
}

export default AdminError
