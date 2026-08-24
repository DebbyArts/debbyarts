import Link from "next/link"
import type { ReactNode } from "react"

import { AdminMobileNavigation } from "@/components/shared/admin-mobile-navigation"
import {
  ADMIN_NAVIGATION,
  type AdminSection,
} from "@/components/shared/admin-navigation"
import { cn } from "@/lib/utils"

type AdminShellProps = {
  accountAction?: ReactNode
  accountName?: string
  activeSection: AdminSection
  children: ReactNode
}

function AdminShell({
  accountAction,
  accountName = "Deborah",
  activeSection,
  children,
}: AdminShellProps) {
  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="sticky top-0 hidden h-screen w-[15.625rem] shrink-0 flex-col justify-between bg-foreground px-5 py-[1.625rem] text-white lg:flex">
        <div className="flex flex-col gap-[2.125rem]">
          <div className="flex flex-col gap-1 px-2.5 py-1">
            <p className="font-display text-xl leading-6">
              DEBBY ART &amp; PRINTS
            </p>
            <p className="text-[0.6875rem] leading-[0.9375rem] font-extrabold tracking-[0.14em] text-warning">
              ADMIN
            </p>
          </div>
          <nav aria-label="Admin navigation" className="flex flex-col gap-2">
            {ADMIN_NAVIGATION.map((item) => (
              <Link
                key={item.section}
                href={item.href}
                aria-current={
                  activeSection === item.section ? "page" : undefined
                }
                className={cn(
                  "flex h-12 items-center rounded-sm px-3.5 text-sm leading-[1.125rem] font-bold transition-colors hover:bg-white/10",
                  activeSection === item.section &&
                    "bg-primary font-extrabold text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-3 px-2.5 text-[0.8125rem] leading-4">
          <p className="font-bold">{accountName}</p>
          <p className="text-xs text-white/65">Owner access</p>
          <div className="flex min-h-11 items-center [&_a]:min-h-11 [&_button]:min-h-11">
            {accountAction}
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <AdminMobileNavigation
          accountAction={accountAction}
          accountName={accountName}
          activeSection={activeSection}
        />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  )
}

export { AdminShell, type AdminShellProps }
