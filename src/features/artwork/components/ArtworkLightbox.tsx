"use client"

import { ArrowLeftIcon, ArrowRightIcon, XIcon } from "lucide-react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react"

import { Button } from "@/components/ui/button"
import {
  buildArtworkRequestHref,
  formatArtworkPrice,
  getArtworkAvailabilityLabel,
  getArtworkCategoryItemLabel,
  type ArtworkProjection,
} from "@/features/artwork/artwork-catalogue"
import { ArtworkMedia } from "@/features/artwork/components/ArtworkMedia"

type ArtworkLightboxProps = {
  artworks: ArtworkProjection[]
  onClose: () => void
  onSelect: (index: number) => void
  openerRef: RefObject<HTMLButtonElement | null>
  selectedIndex: number | null
}

function ArtworkLightbox({
  artworks,
  onClose,
  onSelect,
  openerRef,
  selectedIndex,
}: ArtworkLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [direction, setDirection] = useState<1 | -1>(1)
  const reduceMotion = useReducedMotion()
  const artwork = selectedIndex === null ? null : artworks[selectedIndex]
  const isOpen = selectedIndex !== null

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (isOpen && !dialog.open) {
      dialog.showModal()
      const previousOverflow = document.documentElement.style.overflow
      document.documentElement.style.overflow = "hidden"
      window.requestAnimationFrame(() => closeButtonRef.current?.focus())

      return () => {
        document.documentElement.style.overflow = previousOverflow
      }
    }

    if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  function closeDialog() {
    dialogRef.current?.close()
    onClose()
    window.requestAnimationFrame(() => openerRef.current?.focus())
  }

  function moveSelection(offset: number) {
    if (selectedIndex === null) {
      return
    }

    const nextIndex = selectedIndex + offset

    if (nextIndex >= 0 && nextIndex < artworks.length) {
      setDirection(offset > 0 ? 1 : -1)
      onSelect(nextIndex)
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault()
      moveSelection(-1)
    }

    if (event.key === "ArrowRight") {
      event.preventDefault()
      moveSelection(1)
    }

    if (event.key === "Escape") {
      event.preventDefault()
      closeDialog()
    }
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      closeDialog()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="ArtworkLightbox-title"
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault()
        closeDialog()
      }}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto bg-transparent p-0 backdrop:bg-transparent open:flex open:items-start open:justify-center lg:open:items-center"
    >
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 bg-black/75"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.16 }}
        onClick={closeDialog}
      />
      <AnimatePresence mode="wait" custom={direction} initial={false}>
      {artwork ? (
        <motion.div
          key={artwork.slug}
          custom={direction}
          className="relative z-10 flex min-h-dvh w-full max-w-[76.875rem] flex-col bg-background lg:min-h-0 lg:grid lg:h-[min(53.125rem,calc(100dvh-2rem))] lg:grid-cols-[minmax(0,47.5rem)_minmax(20rem,1fr)] lg:gap-7 lg:p-7"
          initial={{
            opacity: 0,
            x: reduceMotion ? 0 : direction * 18,
            scale: 0.99,
          }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{
            opacity: 0,
            x: reduceMotion ? 0 : direction * -14,
            scale: 0.99,
          }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex min-h-[31.25rem] items-center justify-center bg-[#11110f] p-6 lg:min-h-0 lg:p-9">
            <ArtworkMedia
              key={artwork.slug}
              alt={artwork.imageAlt}
              src={artwork.imageSrc}
              contain
              eager
              sizes="(max-width: 1023px) 100vw, 760px"
              className="h-[min(26.875rem,55vh)] w-full max-w-[36.25rem] border-0 bg-[#11110f] lg:h-full lg:max-h-[45rem]"
            />
          </div>

          <div className="flex min-h-[21.875rem] flex-col gap-8 p-6 pt-7 lg:min-h-0 lg:justify-between lg:overflow-y-auto lg:px-2 lg:pt-[3.375rem] lg:pb-3">
            <div className="flex flex-col gap-[1.125rem] pr-12 lg:pr-0">
              <p className="type-label text-primary">
                {getArtworkCategoryItemLabel(artwork.category)}
              </p>
              <h2 id="ArtworkLightbox-title" className="type-h2 uppercase">
                {artwork.title}
              </h2>
              <div className="h-px bg-border" />
              <div className="hidden lg:block">
                <ArtworkDetails artwork={artwork} />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button asChild className="w-full">
                <Link href={buildArtworkRequestHref(artwork.slug)}>
                  Ask About This Piece ↗
                </Link>
              </Button>
              <div className="flex justify-between gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={selectedIndex === 0}
                  onClick={() => moveSelection(-1)}
                  className="min-h-11 px-0 text-[0.8125rem]"
                >
                  <ArrowLeftIcon aria-hidden="true" />
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={selectedIndex === artworks.length - 1}
                  onClick={() => moveSelection(1)}
                  className="min-h-11 px-0 text-[0.8125rem]"
                >
                  Next
                  <ArrowRightIcon aria-hidden="true" />
                </Button>
              </div>
              <p className="text-center text-[0.6875rem] leading-[1.125rem] text-muted-foreground">
                Use arrow keys to browse · Esc to close
              </p>
              <div className="border-t border-border pt-5 lg:hidden">
                <ArtworkDetails artwork={artwork} />
              </div>
            </div>
          </div>

          <Button
            ref={closeButtonRef}
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Close artwork lightbox"
            onClick={closeDialog}
            className="absolute top-4 right-4 bg-background lg:top-[1.375rem] lg:right-7"
          >
            <XIcon aria-hidden="true" />
          </Button>
        </motion.div>
      ) : null}
      </AnimatePresence>
    </dialog>
  )
}

function ArtworkDetails({ artwork }: { artwork: ArtworkProjection }) {
  return (
    <div className="flex flex-col gap-5">
      {artwork.description ? (
        <p className="text-[0.9375rem] leading-6 text-muted-foreground">
          {artwork.description}
        </p>
      ) : null}
      <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-sm leading-5">
        {artwork.mediumFormat ? (
          <MetadataRow label="Medium" value={artwork.mediumFormat} />
        ) : null}
        {artwork.displayedPieceDimensions ? (
          <MetadataRow
            label="Dimensions"
            value={artwork.displayedPieceDimensions}
          />
        ) : null}
        <MetadataRow
          label="Availability"
          value={getArtworkAvailabilityLabel(artwork.availability)}
        />
        <MetadataRow label="Price" value={formatArtworkPrice(artwork)} />
      </dl>
    </div>
  )
}

function MetadataRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="font-extrabold">{label}</dt>
      <dd className="text-muted-foreground">{value}</dd>
    </>
  )
}

export { ArtworkLightbox }
