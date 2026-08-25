"use client"

import { MenuIcon } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import {
  ADMIN_NAVIGATION,
  type AdminSection,
} from "@/components/shared/admin/admin-navigation"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type AdminMobileNavigationProps = {
  accountAction?: ReactNode
  accountName: string
  activeSection: AdminSection
}

function AdminMobileNavigation({
  accountAction,
  accountName,
  activeSection,
}: AdminMobileNavigationProps) {
  return (
    <header className="flex h-[7.625rem] flex-col gap-4 bg-foreground px-5 pb-[1.125rem] text-primary-foreground lg:hidden">
      <div className="flex h-11 items-center justify-between">
        <p className="font-display text-base leading-5">DEBBY ADMIN</p>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Open Admin navigation"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="border-border-muted bg-foreground text-white">
            <SheetHeader className="border-b border-white/20">
              <SheetTitle className="text-white">Debby Admin</SheetTitle>
              <SheetDescription className="text-white/65">
                Owner navigation
              </SheetDescription>
            </SheetHeader>
            <nav aria-label="Admin menu" className="flex flex-col px-6">
              {ADMIN_NAVIGATION.map((item) => (
                <SheetClose asChild key={item.section}>
                  <Link
                    href={item.href}
                    aria-current={
                      activeSection === item.section ? "page" : undefined
                    }
                    className={cn(
                      "flex min-h-12 items-center border-b border-white/20 text-sm font-bold text-white transition-colors hover:text-primary",
                      activeSection === item.section && "text-primary"
                    )}
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
            <SheetFooter className="border-t border-white/20 text-sm">
              <p className="font-bold">{accountName}</p>
              <p className="text-xs text-white/65">Owner access</p>
              <div className="flex min-h-11 items-center [&_a]:min-h-11 [&_button]:min-h-11">
                {accountAction}
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <nav aria-label="Admin sections" className="flex gap-1.5">
        {ADMIN_NAVIGATION.map((item) => (
          <Link
            key={item.section}
            href={item.href}
            aria-current={activeSection === item.section ? "page" : undefined}
            className={cn(
              "flex h-11 min-w-0 flex-1 items-center justify-center text-[0.6875rem] leading-3.5 font-extrabold text-white/70 transition-colors hover:bg-white/10 hover:text-white",
              activeSection === item.section && "bg-primary text-white"
            )}
          >
            {item.mobileLabel}
          </Link>
        ))}
      </nav>
    </header>
  )
}

export { AdminMobileNavigation, type AdminMobileNavigationProps }
