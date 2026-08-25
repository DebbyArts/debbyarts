import { cn } from "@/lib/utils"

function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 w-fit items-center rounded-pill border border-border px-3.5 text-[0.6875rem] leading-3.5 font-extrabold tracking-label",
        className
      )}
    >
      {children}
    </span>
  )
}

export { Eyebrow }
