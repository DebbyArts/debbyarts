import { DesignReadiness } from "@/db/generated/prisma/enums"

const DESIGN_READINESS_OPTIONS = [
  {
    value: DesignReadiness.FINISHED_DESIGN,
    label: "I have a finished design",
  },
  {
    value: DesignReadiness.NEEDS_DESIGN_HELP,
    label: "I need design help",
  },
  {
    value: DesignReadiness.NOT_SURE,
    label: "I'm not sure",
  },
] as const

export { DESIGN_READINESS_OPTIONS }
