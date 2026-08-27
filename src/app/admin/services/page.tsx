import {
  ServiceAdminListPage,
  type ServiceListSearchParams,
} from "@/features/services"
import { SignOutButton } from "@/features/admin-auth/components/sign-out-button"

type ServiceRouteProps = {
  searchParams: Promise<ServiceListSearchParams>
}

export default function ServiceRoute({ searchParams }: ServiceRouteProps) {
  return (
    <ServiceAdminListPage
      accountAction={<SignOutButton />}
      searchParams={searchParams}
    />
  )
}
