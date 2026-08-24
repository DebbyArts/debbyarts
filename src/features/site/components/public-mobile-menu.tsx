"use client"

import { MenuIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import {
  PUBLIC_NAVIGATION,
  type PublicPath,
} from "@/features/site/navigation"

type PublicMobileMenuProps = {
  activePath: PublicPath
}

function PublicMobileMenu({ activePath }: PublicMobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Open navigation"
          className="bg-card"
        >
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-background">
        <SheetHeader className="border-b border-border-subtle">
          <SheetTitle>Debby Art &amp; Prints</SheetTitle>
          <SheetDescription>Creative studio navigation</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile navigation" className="flex flex-col px-6">
          {PUBLIC_NAVIGATION.map((item) => (
            <SheetClose asChild key={item.href}>
              <Link
                href={item.href}
                aria-current={activePath === item.href ? "page" : undefined}
                className={cn(
                  "flex min-h-12 items-center border-b border-border-subtle text-sm font-bold transition-colors hover:text-primary",
                  activePath === item.href && "text-primary"
                )}
              >
                {item.label}
                {activePath === item.href ? " ↗" : ""}
              </Link>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export { PublicMobileMenu }
