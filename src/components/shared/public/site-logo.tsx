import Image from "next/image"

import { cn } from "@/lib/utils"

type SiteLogoProps = {
  className?: string
  eager?: boolean
}

function SiteLogo({ className, eager = false }: SiteLogoProps) {
  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-xs border border-border-subtle bg-card",
        className
      )}
    >
      <Image
        fill
        alt=""
        loading={eager ? "eager" : "lazy"}
        sizes="112px"
        src="/debby-art-prints-logo.jpg"
        className="object-contain"
      />
    </span>
  )
}

export { SiteLogo }
