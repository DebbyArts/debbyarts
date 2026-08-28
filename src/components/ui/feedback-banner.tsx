import type { ReactNode } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/utils/cn"

const feedbackBannerVariants = cva(
  "flex min-h-11 items-center justify-between gap-3 border px-3.5 py-3 text-xs leading-[1.125rem]",
  {
    variants: {
      tone: {
        success:
          "border-success-border bg-success-surface text-success-surface-foreground",
        error:
          "border-destructive-border bg-destructive-surface text-destructive-surface-foreground",
        warning:
          "border-warning-border bg-warning-surface text-warning-surface-foreground",
      },
    },
    defaultVariants: {
      tone: "success",
    },
  }
)

type FeedbackBannerProps = React.ComponentProps<"div"> &
  VariantProps<typeof feedbackBannerVariants> & {
    action?: ReactNode
  }

function FeedbackBanner({
  action,
  className,
  children,
  tone,
  ...props
}: FeedbackBannerProps) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      data-slot="feedback-banner"
      className={cn(feedbackBannerVariants({ tone }), className)}
      {...props}
    >
      <div className="min-w-0">{children}</div>
      {action ? <div className="shrink-0 font-extrabold">{action}</div> : null}
    </div>
  )
}

export {
  FeedbackBanner,
  feedbackBannerVariants,
  type FeedbackBannerProps,
}
