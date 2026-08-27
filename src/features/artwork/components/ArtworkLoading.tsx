import { Skeleton } from "@/components/ui/skeleton"

function ArtworkLoading() {
  return (
    <div aria-label="Loading artwork gallery" role="status">
      <section className="border-b-2 border-border py-14 lg:py-[4.5rem]">
        <div className="page-container flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-28 w-[19rem] lg:h-44 lg:w-[39rem]" />
          </div>
          <Skeleton className="h-24 w-full max-w-[26.25rem]" />
        </div>
      </section>
      <section className="border-b border-border bg-card py-5">
        <div className="page-container flex gap-2">
          <Skeleton className="h-11 w-28" />
          <Skeleton className="h-11 w-24" />
          <Skeleton className="h-11 w-36" />
        </div>
      </section>
      <section className="page-container columns-2 gap-4 py-10 lg:columns-3 lg:gap-7 lg:py-[4.5rem]">
        {["h-72", "h-52", "h-80", "h-64", "h-56", "h-72"].map(
          (height, index) => (
            <div key={index} className="mb-7 break-inside-avoid lg:mb-10">
              <Skeleton className={`${height} w-full`} />
              <Skeleton className="mt-3 h-6 w-2/3" />
            </div>
          )
        )}
      </section>
      <span className="sr-only">Loading artwork gallery</span>
    </div>
  )
}

export { ArtworkLoading }
