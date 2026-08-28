"use client"

import { motion, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"

import { cn } from "@/shared/utils/cn"

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  once?: boolean
}

function Reveal({ children, className, delay = 0, once = true }: RevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.46, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once, amount: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

export { Reveal }
