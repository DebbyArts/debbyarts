"use client"

import { Button } from "@/components/ui/button"

function WhatsAppContinuation({ phone }: { phone: string }) {
  const number = phone.replace(/\D/g, "")

  if (number.length < 8 || number.length > 15) {
    return (
      <p role="alert" className="text-sm text-destructive">
        The saved WhatsApp number is invalid.
      </p>
    )
  }

  return (
    <Button asChild className="bg-success hover:bg-success/90">
      <a
        href={`https://wa.me/${number}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Continue on WhatsApp
      </a>
    </Button>
  )
}

export { WhatsAppContinuation }
