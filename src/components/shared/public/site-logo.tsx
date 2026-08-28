import Image from "next/image"

import { cn } from "@/shared/utils/cn"

type SiteLogoProps = {
  className?: string
  eager?: boolean
}

function SiteLogo({ className, eager = false }: SiteLogoProps) {
  return (
    <span
      className={cn(
        "relative block shrink-0",
        className
      )}
    >
      <Image
        fill
        alt=""
        loading={eager ? "eager" : "lazy"}
        sizes="112px"
        src="/debby-art-prints-logo.webp"
        className="object-contain"
      />
    </span>
  )
}

export { SiteLogo }
