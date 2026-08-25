"use client"

import { ErrorState } from "@/components/ui/states/error"
import { Button } from "@/components/ui/button"
import { PublicShell } from "@/components/shared/public/public-shell"

export default function ArtError({ reset }: { reset: () => void }) {
  return (
    <PublicShell activePath="/art">
      <div className="page-container py-20 lg:py-30">
        <ErrorState
          title="The gallery could not be loaded"
          description="Please try again. If the problem continues, the gallery may be temporarily unavailable."
          action={
            <Button type="button" size="sm" onClick={reset}>
              Try again
            </Button>
          }
          className="min-h-[18rem] items-center justify-center text-center"
        />
      </div>
    </PublicShell>
  )
}
