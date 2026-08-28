import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/shared/utils/cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-border bg-clip-padding text-sm font-extrabold transition-all duration-200 ease-out outline-none select-none hover:-translate-y-0.5 focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:translate-y-0 disabled:border-disabled-border disabled:bg-disabled disabled:text-muted-foreground disabled:opacity-100 aria-busy:pointer-events-none aria-busy:cursor-wait aria-busy:translate-y-0 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/25 motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0 motion-reduce:transition-colors [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active",
        outline:
          "bg-card text-foreground hover:bg-muted aria-expanded:bg-muted",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/85 aria-expanded:bg-secondary",
        ghost: "border-transparent hover:bg-muted hover:text-foreground",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive",
        "destructive-outline":
          "border-2 border-destructive bg-card text-destructive hover:bg-destructive-surface active:bg-destructive-surface",
        link: "h-auto border-transparent p-0 text-foreground underline decoration-2 underline-offset-4 hover:translate-y-0 hover:text-primary",
      },
      size: {
        default: "h-12 px-5",
        sm: "h-11 px-4 text-xs",
        lg: "h-[3.25rem] px-6",
        icon: "size-12",
        "icon-sm": "size-11",
        "icon-lg": "size-[3.25rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
