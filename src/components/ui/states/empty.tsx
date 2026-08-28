import type { ReactNode } from "react"

import { cn } from "@/shared/utils/cn"

type EmptyStateProps = React.ComponentProps<"div"> & {
  action?: ReactNode
  description: ReactNode
  title: ReactNode
  visual?: ReactNode
}

function EmptyState({
  action,
  className,
  description,
  title,
  visual,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex min-h-[11.875rem] flex-col items-center justify-center gap-2.5 border border-dashed border-border-muted bg-surface-subtle p-6 text-center",
        className
      )}
      {...props}
    >
      {visual ? (
        <div
          aria-hidden="true"
          className="flex size-[2.875rem] items-center justify-center border border-border-subtle font-display text-xl leading-6"
        >
          {visual}
        </div>
      ) : null}
      <p className="text-sm leading-[1.125rem] font-extrabold">{title}</p>
      <p className="max-w-sm text-xs leading-[1.125rem] text-muted-foreground">
        {description}
      </p>
      {action ? <div>{action}</div> : null}
    </div>
  )
}

export { EmptyState, type EmptyStateProps }
