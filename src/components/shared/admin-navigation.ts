const ADMIN_NAVIGATION = [
  {
    href: "/admin/artwork",
    label: "Art & Gallery",
    mobileLabel: "Artwork",
    section: "artwork",
  },
  {
    href: "/admin/services",
    label: "Services",
    mobileLabel: "Services",
    section: "services",
  },
  {
    href: "/admin/enquiries",
    label: "Enquiries",
    mobileLabel: "Enquiries",
    section: "enquiries",
  },
] as const

type AdminSection = (typeof ADMIN_NAVIGATION)[number]["section"]

export { ADMIN_NAVIGATION, type AdminSection }
