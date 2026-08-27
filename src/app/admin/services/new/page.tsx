import { ServiceNewPage } from "@/features/services"
import { SignOutButton } from "@/features/admin-auth/components/sign-out-button"

export default function ServiceNewRoute() {
  return <ServiceNewPage accountAction={<SignOutButton />} />
}
