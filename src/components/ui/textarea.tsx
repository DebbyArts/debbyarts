import * as React from "react"

import { cn } from "@/shared/utils/cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-28 w-full rounded-sm border border-input bg-card px-4 py-3 text-base leading-body text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-info focus-visible:ring-[3px] focus-visible:ring-ring/70 disabled:cursor-not-allowed disabled:border-disabled-border disabled:bg-disabled disabled:text-muted-foreground disabled:opacity-100 aria-invalid:border-2 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
