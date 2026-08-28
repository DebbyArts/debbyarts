"use client"

import type { ReactNode } from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/shared/utils/cn"

type SelectableOptionProps = Omit<
  React.ComponentProps<typeof RadioGroupPrimitive.Item>,
  "children"
> & {
  description?: ReactNode
  media?: ReactNode
  title: ReactNode
}

function SelectableOption({
  className,
  description,
  media,
  title,
  ...props
}: SelectableOptionProps) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="selectable-option"
      className={cn(
        "group/option flex min-h-16 w-full cursor-pointer items-center gap-3 border-2 border-border bg-card p-3.5 text-left transition-colors outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:border-disabled-border disabled:bg-disabled disabled:text-muted-foreground data-checked:bg-warning data-checked:hover:bg-warning",
        className
      )}
      {...props}
    >
      {media ? (
        <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden border border-border">
          {media}
        </span>
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm leading-[1.125rem] font-bold">{title}</span>
        {description ? (
          <span className="text-xs leading-[1.125rem] text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
      <span
        aria-hidden="true"
        className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-input bg-card group-data-checked/option:border-foreground group-data-checked/option:bg-foreground"
      >
        <RadioGroupPrimitive.Indicator>
          <span className="block size-2 rounded-full bg-warning" />
        </RadioGroupPrimitive.Indicator>
      </span>
    </RadioGroupPrimitive.Item>
  )
}

export { SelectableOption, type SelectableOptionProps }
