import type { NextRequest } from "next/server"

import { refreshAdminSession } from "@/server/auth/proxy"

async function proxy(request: NextRequest) {
  return refreshAdminSession(request)
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
}

export { proxy }
