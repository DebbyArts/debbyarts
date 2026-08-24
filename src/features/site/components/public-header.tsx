import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PublicMobileMenu } from "@/features/site/components/public-mobile-menu"
import { SiteLogo } from "@/features/site/components/site-logo"
import {
  PUBLIC_NAVIGATION,
  type PublicPath,
} from "@/features/site/navigation"

type PublicHeaderProps = {
  activePath: PublicPath
}

function PublicHeader({ activePath }: PublicHeaderProps) {
  const desktopNavigation = PUBLIC_NAVIGATION.filter(
    (item) => item.href === "/art" || item.href === "/services"
  )

  return (
    <header className="border-b border-border bg-background">
      <div className="hidden h-24 items-center justify-between px-16 min-[1280px]:flex">
        <Link
          href="/"
          aria-label="Debby Art & Prints home"
          className="flex w-[21.25rem] items-center gap-4"
        >
          <SiteLogo eager className="h-[3.25rem] w-[5.375rem]" />
          <span className="flex flex-col gap-0.5">
            <span className="text-[0.9375rem] leading-5 font-extrabold">
              Debby Art &amp; Prints
            </span>
            <span className="text-[0.6875rem] leading-3.5 tracking-label text-muted-foreground">
              CREATIVE STUDIO
            </span>
          </span>
        </Link>
        <nav
          aria-label="Primary navigation"
          className="flex w-[26.25rem] items-center justify-center gap-11"
        >
          {desktopNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={activePath === item.href ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center border-b-[3px] border-transparent text-sm leading-[1.125rem] font-bold transition-colors hover:border-primary hover:text-primary",
                activePath === item.href && "border-primary text-primary"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex w-[21.25rem] justify-end">
          <Button asChild className="h-[3.125rem] px-6">
            <Link
              href="/request"
              aria-current={activePath === "/request" ? "page" : undefined}
            >
              Make a Request ↗
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex h-[4.75rem] items-center justify-between px-[1.125rem] min-[1280px]:hidden">
        <Link
          href="/"
          aria-label="Debby Art & Prints home"
          className="flex min-h-11 items-center gap-2"
        >
          <SiteLogo eager className="h-[2.125rem] w-[3.625rem]" />
          <span className="text-xs leading-[0.9375rem] font-extrabold">
            Debby Art
            <br />
            &amp; Prints
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="px-[0.8125rem] text-[0.6875rem]">
            <Link
              href="/request"
              aria-current={activePath === "/request" ? "page" : undefined}
            >
              Make a Request
            </Link>
          </Button>
          <PublicMobileMenu activePath={activePath} />
        </div>
      </div>
    </header>
  )
}

export { PublicHeader, type PublicHeaderProps }
