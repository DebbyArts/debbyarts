import Link from "next/link"
import * as motion from "motion/react-client"

import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { requestSteps } from "@/features/home/constants"
import { cn } from "@/lib/utils"
import { Eyebrow } from "./eyebrow"

function RequestProcess() {
  return (
    <section aria-labelledby="request-process-heading" className="relative overflow-hidden bg-foreground text-white">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-2 bg-info min-[1400px]:w-[1.125rem]"
      />
      <Container className="flex flex-col gap-12 py-20 pr-8 min-[1400px]:min-h-[56.25rem] min-[1400px]:flex-row min-[1400px]:gap-[4.875rem] min-[1400px]:px-[4.5rem] min-[1400px]:py-[7rem]">
        <div className="flex flex-col justify-between gap-12 min-[1400px]:w-[26.875rem]">
          <div className="flex flex-col gap-6">
            <Eyebrow className="border-white bg-accent text-accent-foreground">
              A SIMPLE REQUEST PROCESS
            </Eyebrow>
            <h2 id="request-process-heading" className="type-h2">
              HOW
              <br /> REQUESTS
              <br /> WORK
            </h2>
            <p className="max-w-[22.5rem] text-[1.0625rem] leading-[1.6875rem] text-border-subtle">
              Choose what you’re interested in, share a few useful details and
              submit your request.
            </p>
          </div>
          <div className="hidden flex-col gap-4 min-[1400px]:flex">
            <Button asChild size="lg" className="w-fit border-white">
              <Link href="/request">Make a Request ↗</Link>
            </Button>
            <p className="text-[0.6875rem] leading-3.5 font-extrabold tracking-label text-accent">
              START WHEN YOU’RE READY
            </p>
          </div>
        </div>

        <motion.ol
          className="flex flex-1 flex-col min-[1400px]:pt-[1.375rem]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
        >
          {requestSteps.map(([description, action], index) => (
            <motion.li
              key={action}
              className={cn(
                "flex min-h-36 items-center gap-5 border-t border-muted-foreground py-6 min-[1400px]:min-h-[9.25rem] min-[1400px]:gap-6",
                index % 2 === 1 && "min-[1400px]:pl-10",
                index === requestSteps.length - 1 && "border-b"
              )}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-pill border border-white font-display text-lg leading-6 min-[1400px]:size-16 min-[1400px]:text-2xl min-[1400px]:leading-[1.875rem]",
                  index === 0 && "bg-info text-info-foreground",
                  index === 1 && "bg-primary",
                  index === 2 && "bg-accent text-foreground",
                  index === 3 && "bg-white text-foreground"
                )}
                initial={{ scale: 0.82 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", visualDuration: 0.35, bounce: 0.12, delay: index * 0.09 }}
              >
                {String(index + 1).padStart(2, "0")}
              </motion.span>
              <p className="flex-1 text-base leading-6 font-bold min-[1400px]:text-[1.375rem] min-[1400px]:leading-[1.875rem]">
                {description}
              </p>
              <span className="hidden w-[9.375rem] shrink-0 text-[0.6875rem] leading-[0.9375rem] font-extrabold tracking-label text-accent sm:block">
                {action}
              </span>
            </motion.li>
          ))}
        </motion.ol>

        <Button asChild size="lg" className="border-white min-[1400px]:hidden">
          <Link href="/request">Make a Request ↗</Link>
        </Button>
      </Container>
    </section>
  )
}

export { RequestProcess }
