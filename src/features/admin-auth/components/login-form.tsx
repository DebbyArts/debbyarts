"use client"

import { useActionState } from "react"

import { FeedbackBanner } from "@/components/ui/feedback-banner"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  requestMagicLinkAction,
} from "@/features/admin-auth/actions"
import { INITIAL_LOGIN_STATE } from "@/features/admin-auth/state"

function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(
    requestMagicLinkAction,
    INITIAL_LOGIN_STATE
  )

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />
      <Field>
        <FieldLabel htmlFor="email" required>
          Owner email
        </FieldLabel>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          aria-describedby="email-help"
        />
        <FieldDescription id="email-help">
          Use the email provisioned for Debby Art &amp; Prints owner access.
        </FieldDescription>
      </Field>
      {state.status !== "idle" ? (
        <FeedbackBanner tone={state.status === "error" ? "error" : "success"}>
          {state.message}
        </FeedbackBanner>
      ) : null}
      <Button type="submit" disabled={pending} aria-busy={pending}>
        {pending ? "Sending secure link…" : "Email me a sign-in link"}
      </Button>
    </form>
  )
}

export { LoginForm }
