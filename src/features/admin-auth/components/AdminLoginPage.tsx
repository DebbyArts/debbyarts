import { LoginForm } from "@/features/admin-auth/components/login-form"
import { safeAdminRedirect } from "@/server/auth/config"

type AdminLoginSearchParams = {
  configuration?: string
  error?: string
  next?: string
  signedOut?: string
}

type AdminLoginPageProps = {
  searchParams: Promise<AdminLoginSearchParams>
}

async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const query = await searchParams
  const next = safeAdminRedirect(query.next)

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <section className="w-full max-w-[31rem] border border-border-muted bg-card p-6 sm:p-9">
        <div className="mb-7 flex flex-col gap-3 border-b border-border-subtle pb-6">
          <p className="type-label text-primary">Owner workspace</p>
          <h1 className="font-display text-[2.5rem] leading-[2.625rem] tracking-tight">
            DEBBY ADMIN
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Secure passwordless access to artwork, services and enquiries.
          </p>
        </div>
        {query.error ? (
          <p role="alert" className="mb-5 text-sm font-bold text-destructive">
            That sign-in link is invalid or expired. Request a new one below.
          </p>
        ) : null}
        {query.configuration ? (
          <p role="alert" className="mb-5 text-sm font-bold text-destructive">
            Owner authentication is not configured for this environment yet.
          </p>
        ) : null}
        {query.signedOut ? (
          <p role="status" className="mb-5 text-sm font-bold text-success">
            You have signed out securely.
          </p>
        ) : null}
        <LoginForm next={next} />
      </section>
    </main>
  )
}

export { AdminLoginPage, type AdminLoginSearchParams }
