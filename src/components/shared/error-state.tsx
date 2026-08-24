import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type ErrorStateProps = React.ComponentProps<"div"> & {
  action?: ReactNode
  description: ReactNode
  title: ReactNode
}

function ErrorState({
  action,
  className,
  description,
  title,
  ...props
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      data-slot="error-state"
      className={cn(
        "flex flex-col gap-1.5 border border-destructive-border bg-destructive-surface p-4 text-destructive-surface-foreground",
        className
      )}
      {...props}
    >
      <p className="text-xs leading-4 font-extrabold">{title}</p>
      <p className="text-xs leading-[1.125rem]">{description}</p>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  )
}

export { ErrorState, type ErrorStateProps }
