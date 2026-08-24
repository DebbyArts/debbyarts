import { Container } from "@/components/shared/container"
import { Skeleton } from "@/components/ui/skeleton"

function ServicesLoading() {
  return (
    <div role="status" aria-label="Loading services">
      <section className="border-b-2 border-border">
        <Container className="flex flex-col gap-6 py-14 lg:flex-row lg:items-end lg:justify-between lg:py-24">
          <div className="flex flex-col gap-5">
            <Skeleton className="h-3 w-56" />
            <Skeleton className="h-14 w-72 lg:h-24 lg:w-[31rem]" />
          </div>
          <div className="flex w-full max-w-[26.875rem] flex-col gap-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-64" />
          </div>
        </Container>
      </section>
      <section className="border-b-2 border-border bg-card">
        <Container className="grid gap-2 py-5 md:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-13 md:h-16" />
          ))}
        </Container>
      </section>
      <Container className="py-12 lg:py-20">
        <div className="flex flex-col gap-3 border-b-2 border-border pb-6">
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-10 w-72" />
        </div>
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="grid gap-5 border-b-2 border-border py-8 lg:grid-cols-[23.75rem_1fr] lg:gap-10 lg:py-11"
          >
            <Skeleton className="h-[15.625rem] lg:h-[18.75rem]" />
            <div className="flex flex-col gap-4 py-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-10 w-[70%]" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[84%]" />
            </div>
          </div>
        ))}
      </Container>
      <span className="sr-only">Loading services</span>
    </div>
  )
}

export { ServicesLoading }
