import type { ComponentProps } from "react";

import { cn } from "@/shared/utils/cn";

function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("page-container", className)} {...props} />;
}

export { Container };
