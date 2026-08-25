import Link from "next/link"

import { SiteLogo } from "@/components/shared/public/site-logo"
import {
  PUBLIC_NAVIGATION,
  PUBLIC_PAGE_LABELS,
  type PublicPath,
} from "@/components/shared/public/navigation"

type PublicFooterProps = {
  activePath: PublicPath
}

function FooterNavigation() {
  return (
    <nav aria-label="Footer navigation" className="flex flex-col">
      {PUBLIC_NAVIGATION.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex min-h-11 items-center text-[0.8125rem] leading-7 font-bold hover:text-primary lg:min-h-7 lg:text-sm lg:leading-[1.625rem]"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

function PublicFooter({ activePath }: PublicFooterProps) {
  const pageLabel = PUBLIC_PAGE_LABELS[activePath]

  return (
    <footer className="border-t border-border bg-background">
      <div className="hidden h-[21.25rem] flex-col justify-between px-[4.5rem] pt-16 pb-10 lg:flex">
        <div className="flex items-start justify-between">
          <div className="flex w-[23.75rem] items-center gap-[1.125rem]">
            <SiteLogo className="h-16 w-28" />
            <div className="flex flex-col gap-1.5">
              <p className="text-base leading-5 font-extrabold">
                Debby Art &amp; Prints
              </p>
              <p className="text-xs leading-[1.125rem] text-muted-foreground">
                Art + print + branding + personalisation
              </p>
            </div>
          </div>
          <div className="flex w-[15.625rem] flex-col gap-4">
            <p className="text-[0.6875rem] leading-3.5 font-extrabold tracking-label text-primary">
              NAVIGATION
            </p>
            <FooterNavigation />
          </div>
          <div className="flex w-[15.625rem] flex-col gap-4">
            <p className="text-[0.6875rem] leading-3.5 font-extrabold tracking-label text-primary">
              STUDIO
            </p>
            <p className="text-sm leading-[1.625rem]">
              Lagos + nationwide
              <br />
              TikTok · @debbyartprint
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border-subtle pt-6">
          <p className="text-xs leading-4 text-muted-foreground">
            © Debby Art &amp; Prints
          </p>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-2 w-[3.375rem] bg-info" />
            <p className="text-[0.6875rem] leading-3.5 font-extrabold tracking-label">
              DEBBY ART &amp; PRINTS · {pageLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="flex min-h-[29.375rem] flex-col gap-[2.125rem] px-5 pt-12 pb-[1.875rem] lg:hidden">
        <div className="flex items-center gap-3.5">
          <SiteLogo className="h-[3.375rem] w-[5.75rem]" />
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-[0.9375rem] leading-[1.125rem] font-extrabold">
              Debby Art &amp; Prints
            </p>
            <p className="text-[0.6875rem] leading-[1.0625rem] text-muted-foreground">
              Art + print + branding + personalisation
            </p>
          </div>
        </div>
        <div className="flex justify-between gap-5">
          <div className="flex w-[9.375rem] flex-col gap-3">
            <p className="text-[0.5625rem] leading-3 font-extrabold tracking-label text-primary">
              NAVIGATION
            </p>
            <FooterNavigation />
          </div>
          <div className="flex w-[9.375rem] flex-col gap-3">
            <p className="text-[0.5625rem] leading-3 font-extrabold tracking-label text-primary">
              STUDIO
            </p>
            <p className="text-[0.8125rem] leading-[1.5625rem]">
              Lagos + nationwide
              <br />
              TikTok · @debbyartprint
            </p>
          </div>
        </div>
        <div className="mt-auto flex flex-col gap-[1.125rem] border-t border-border-subtle pt-[1.375rem]">
          <span aria-hidden="true" className="h-2 w-[3.375rem] bg-info" />
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.625rem] leading-3 text-muted-foreground">
              © Debby Art &amp; Prints
            </p>
            <p className="text-right text-[0.5rem] leading-2.5 font-extrabold tracking-label">
              DEBBY ART &amp; PRINTS · {pageLabel}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { PublicFooter, type PublicFooterProps }
