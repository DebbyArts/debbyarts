import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/shared/utils/cn"

type LoadingStateProps = React.ComponentProps<"div"> & {
  label?: string
}

function LoadingState({
  className,
  label = "Loading",
  ...props
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-label={label}
      data-slot="loading-state"
      className={cn(
        "flex h-[4.625rem] items-center gap-3.5 border border-border-subtle bg-surface-subtle p-3.5",
        className
      )}
      {...props}
    >
      <Skeleton className="size-12 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="h-2 w-[72%]" />
        <Skeleton className="h-2 w-[48%] bg-skeleton-muted" />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  )
}

export { LoadingState, type LoadingStateProps }
