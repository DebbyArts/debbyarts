const PUBLIC_NAVIGATION = [
  { href: "/", label: "Home" },
  { href: "/art", label: "Art & Gallery" },
  { href: "/services", label: "Services" },
  { href: "/request", label: "Make a Request" },
] as const

type PublicPath = (typeof PUBLIC_NAVIGATION)[number]["href"]

const PUBLIC_PAGE_LABELS: Record<PublicPath, string> = {
  "/": "HOME",
  "/art": "ART & GALLERY",
  "/services": "SERVICES",
  "/request": "MAKE A REQUEST",
}

export { PUBLIC_NAVIGATION, PUBLIC_PAGE_LABELS, type PublicPath }
