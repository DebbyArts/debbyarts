"use client"

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"
import { useEffect, useState } from "react"

function HomeMagneticCta() {
  const reduceMotion = useReducedMotion()
  const [canHover, setCanHover] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const foregroundX = useSpring(x, { visualDuration: 0.35, bounce: 0.12 })
  const foregroundY = useSpring(y, { visualDuration: 0.35, bounce: 0.12 })
  const backgroundX = useSpring(
    useTransform(x, [-14, 14], [-6, 6]),
    { visualDuration: 0.35, bounce: 0.12 }
  )
  const backgroundY = useSpring(
    useTransform(y, [-14, 14], [-6, 6]),
    { visualDuration: 0.35, bounce: 0.12 }
  )

  useEffect(() => {
    if (!("matchMedia" in window)) return

    const query = window.matchMedia("(hover: hover) and (pointer: fine)")
    const update = () => setCanHover(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  const interactive = canHover && !reduceMotion

  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      aria-hidden="true"
      className="relative h-[13.125rem] w-[13.125rem] shrink-0 self-center min-[1400px]:h-[18.75rem] min-[1400px]:w-[18.75rem]"
      onPointerLeave={interactive ? reset : undefined}
      onPointerMove={
        interactive
          ? (event) => {
              const rect = event.currentTarget.getBoundingClientRect()
              const distanceX = event.clientX - (rect.left + rect.width / 2)
              const distanceY = event.clientY - (rect.top + rect.height / 2)
              x.set(Math.max(-14, Math.min(14, distanceX * 0.12)))
              y.set(Math.max(-14, Math.min(14, distanceY * 0.12)))
            }
          : undefined
      }
    >
      <motion.span
        className="absolute bottom-0 left-0 size-[10.75rem] rounded-pill border border-border bg-info min-[1400px]:size-[15.625rem]"
        style={{ x: backgroundX, y: backgroundY }}
      />
      <motion.span
        className="absolute top-0 right-0 flex size-[10.75rem] rotate-6 flex-col items-center justify-center gap-2 rounded-pill border-2 border-primary text-center min-[1400px]:size-[15.625rem] min-[1400px]:gap-3.5"
        style={{ x: foregroundX, y: foregroundY }}
        whileHover={interactive ? { scale: 1.02 } : undefined}
      >
        <span className="font-display text-[1.75rem] leading-[1.875rem] min-[1400px]:text-[2.125rem] min-[1400px]:leading-9">
          MAKE
          <br /> IT REAL
        </span>
        <span className="text-[0.5625rem] leading-3 font-extrabold tracking-label min-[1400px]:text-[0.6875rem] min-[1400px]:leading-3.5">
          ART · PRINT · PERSONAL
        </span>
      </motion.span>
    </div>
  )
}

export { HomeMagneticCta }
