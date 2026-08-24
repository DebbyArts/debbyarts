"use client"

import { useEffect } from "react"

import { Container } from "@/components/shared/container"
import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"

type ServicesErrorProps = {
  error: Error & { digest?: string }
  retry: () => void
}

function ServicesError({ error, retry }: ServicesErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section aria-label="Services error">
      <Container className="flex min-h-[32rem] items-center py-20">
        <ErrorState
          className="w-full p-6"
          title="Services could not be loaded"
          description="This may be temporary. Try loading the published services again."
          action={
            <Button type="button" size="sm" onClick={retry}>
              Try again
            </Button>
          }
        />
      </Container>
    </section>
  )
}

export default ServicesError
