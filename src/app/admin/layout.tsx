import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: { absolute: "Admin | Debby Art & Prints" },
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
  },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children
}
