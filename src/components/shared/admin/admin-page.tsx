import type { ReactNode } from "react"

import { cn } from "@/shared/utils/cn"

function AdminPage({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[74.375rem] flex-col gap-6 px-5 py-8 sm:px-8 lg:px-11 lg:py-10">
      {children}
    </div>
  )
}

function AdminPageHeader({
  action,
  description,
  eyebrow,
  title,
}: {
  action?: ReactNode
  description: ReactNode
  eyebrow: string
  title: string
}) {
  return (
    <header className="flex flex-col gap-5 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 flex-col gap-2">
        <p className="type-label text-primary">{eyebrow}</p>
        <h1 className="font-display text-[2.25rem] leading-[2.5rem] tracking-tight sm:text-[2.625rem] sm:leading-[2.875rem]">
          {title}
        </h1>
        <p className="max-w-[42rem] text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  )
}

function AdminSectionCard({
  children,
  className,
  description,
  title,
}: {
  children: ReactNode
  className?: string
  description?: ReactNode
  title: string
}) {
  return (
    <section
      className={cn(
        "flex flex-col gap-[1.125rem] rounded-sm border border-border-subtle bg-card px-5 py-5 sm:px-7 sm:py-6",
        className
      )}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-[1.375rem] leading-7 font-extrabold">{title}</h2>
        {description ? (
          <p className="text-sm leading-5 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function AdminStatusBadge({
  children,
  tone,
}: {
  children: ReactNode
  tone: "draft" | "new" | "contacted" | "published" | "resolved"
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center px-2.5 text-[0.625rem] leading-3 font-extrabold tracking-[0.04em] uppercase",
        tone === "published" && "bg-success text-success-foreground",
        (tone === "draft" || tone === "new") &&
          "bg-warning-surface text-warning-surface-foreground",
        tone === "contacted" && "bg-muted text-info",
        tone === "resolved" && "bg-success-surface text-success"
      )}
    >
      {children}
    </span>
  )
}

export { AdminPage, AdminPageHeader, AdminSectionCard, AdminStatusBadge }
