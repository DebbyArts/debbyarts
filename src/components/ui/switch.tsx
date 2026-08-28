"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/shared/utils/cn"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer group/switch relative inline-flex h-6 w-10 shrink-0 items-center rounded-pill border border-transparent p-[3px] transition-colors outline-none after:absolute after:-inset-2 focus-visible:ring-[3px] focus-visible:ring-ring/70 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 data-checked:bg-primary data-unchecked:bg-disabled-border data-disabled:cursor-not-allowed data-disabled:bg-disabled data-disabled:opacity-100",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-[1.125rem] rounded-pill bg-card transition-transform group-data-checked/switch:translate-x-4 group-data-unchecked/switch:translate-x-0 motion-reduce:transition-none"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
