import Link from "next/link"

import { Container } from "@/components/shared/container"
import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import { RequestFlow } from "@/features/enquiries/components/request-flow"
import type { LoadRequestPageResult } from "@/features/enquiries/server/load-request-page"

function RequestIntroduction() {
  return (
    <section className="relative border-b-2 border-border">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-2 bg-primary lg:w-[1.125rem]"
      />
      <Container className="flex flex-col gap-7 py-14 pr-8 lg:flex-row lg:items-end lg:justify-between lg:py-20 lg:pr-20">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3.5">
            <span aria-hidden="true" className="h-2 w-11 bg-warning lg:w-[3.625rem]" />
            <p className="type-label">Tell us what you need</p>
          </div>
          <h1 className="type-display">
            MAKE A<br />REQUEST
          </h1>
        </div>
        <div className="flex max-w-[26.25rem] flex-col gap-4">
          <p className="text-[1.0625rem] leading-[1.625rem] lg:text-xl lg:leading-body-lg">
            Choose a few useful details about the artwork or service you need,
            then submit your request.
          </p>
          <p className="text-sm leading-[1.375rem] text-muted-foreground">
            Your enquiry is saved before you continue the conversation on
            WhatsApp.
          </p>
        </div>
      </Container>
    </section>
  )
}

function InvalidRequestContext({ message }: { message: string }) {
  return (
    <Container className="py-16 lg:py-24">
      <div className="mx-auto max-w-2xl">
        <p className="type-label mb-3 text-primary">Request link needs attention</p>
        <h2 className="type-h2 mb-6">LET’S START SAFELY</h2>
        <ErrorState
          className="p-6"
          title="We couldn’t use that request context"
          description={message}
          action={
            <div className="mt-3 flex flex-wrap gap-3">
              <Button asChild size="sm">
                <Link href="/request">Start a general request</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/art">Browse Art &amp; Gallery</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/services">Browse Services</Link>
              </Button>
            </div>
          }
        />
      </div>
    </Container>
  )
}

function RequestPage({ data }: { data: LoadRequestPageResult }) {
  return (
    <>
      <RequestIntroduction />
      {data.status === "invalid" ? (
        <InvalidRequestContext message={data.message} />
      ) : (
        <RequestFlow data={data} />
      )}
    </>
  )
}

export { RequestPage }
