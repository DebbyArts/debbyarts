import { signOutAction } from "@/features/admin-auth/actions"

function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="text-xs font-bold text-white underline decoration-1 underline-offset-4 hover:text-primary"
      >
        Sign out
      </button>
    </form>
  )
}

export { SignOutButton }
