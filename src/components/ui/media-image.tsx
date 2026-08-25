import Image, { type ImageProps } from "next/image"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type MediaImageProps = Omit<
  ImageProps,
  "alt" | "className" | "fill" | "height" | "sizes" | "src" | "width"
> & {
  alt: string
  className?: string
  fallback?: ReactNode
  fit?: "contain" | "cover"
  imageClassName?: string
  sizes: string
  src?: ImageProps["src"]
}

function MediaImage({
  alt,
  className,
  fallback,
  fit = "cover",
  imageClassName,
  sizes,
  src,
  ...imageProps
}: MediaImageProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface-subtle",
        className
      )}
    >
      {src ? (
        <Image
          fill
          alt={alt}
          sizes={sizes}
          src={src}
          className={cn(
            fit === "cover" ? "object-cover" : "object-contain",
            imageClassName
          )}
          {...imageProps}
        />
      ) : (
        <div
          role={alt ? "img" : undefined}
          aria-label={alt || undefined}
          aria-hidden={alt ? undefined : true}
          className="flex size-full min-h-24 items-center justify-center p-4 text-center text-xs text-muted-foreground"
        >
          {fallback ?? "Image unavailable"}
        </div>
      )}
    </div>
  )
}

export { MediaImage, type MediaImageProps }
