import {
  AdminLoginPage,
  type AdminLoginSearchParams,
} from "@/features/admin-auth"

export default function AdminLoginRoute({
  searchParams,
}: {
  searchParams: Promise<AdminLoginSearchParams>
}) {
  return <AdminLoginPage searchParams={searchParams} />
}
