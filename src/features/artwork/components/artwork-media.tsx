"use client"

import { ImageOffIcon } from "lucide-react"
import { type ComponentProps, useState } from "react"

import { MediaImage } from "@/components/ui/media-image"
import { cn } from "@/lib/utils"

type ArtworkMediaProps = Omit<ComponentProps<"div">, "children"> & {
  alt: string
  contain?: boolean
  eager?: boolean
  sizes: string
  src: string | null
}

function ArtworkMedia({
  alt,
  className,
  contain = false,
  eager = false,
  sizes,
  src,
  ...containerProps
}: ArtworkMediaProps) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const resolvedSource = failed ? undefined : src || undefined

  return (
    <div
      className={cn("relative overflow-hidden border border-border", className)}
      {...containerProps}
    >
      <MediaImage
        alt={alt}
        src={resolvedSource}
        sizes={sizes}
        fit={contain ? "contain" : "cover"}
        priority={eager}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className="size-full"
        fallback={
          <span className="flex flex-col items-center gap-2">
            <ImageOffIcon aria-hidden="true" className="size-6" />
            <span>Artwork image unavailable</span>
          </span>
        }
      />
      {resolvedSource && !loaded ? (
        <span
          role="status"
          aria-label="Loading artwork image"
          className="absolute inset-0 animate-pulse bg-skeleton motion-reduce:animate-none"
        />
      ) : null}
    </div>
  )
}

export { ArtworkMedia }
