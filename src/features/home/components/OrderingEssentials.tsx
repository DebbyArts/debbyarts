import * as motion from "motion/react-client"

import { Container } from "@/components/ui/container"
import { essentials } from "@/features/home/constants"
import { cn } from "@/shared/utils/cn"
import { Eyebrow } from "./Eyebrow"

function OrderingEssentials() {
  return (
    <section aria-labelledby="ordering-heading" className="relative bg-background">
      <span aria-hidden="true" className="absolute top-0 right-0 h-3.5 w-[9.375rem] bg-info" />
      <Container className="grid gap-12 py-20 min-[900px]:grid-cols-2 min-[900px]:items-center min-[900px]:gap-8 min-[1400px]:min-h-[45rem] min-[1400px]:grid-cols-[25.625rem_minmax(0,1fr)] min-[1400px]:gap-[4.5rem] min-[1400px]:px-[4.25rem] min-[1400px]:py-24">
        <motion.div
          className="flex min-h-[16.25rem] flex-col justify-between rounded-sm border border-border bg-primary p-8 text-white min-[1400px]:h-[31.25rem] min-[1400px]:w-[25.625rem] min-[1400px]:shrink-0 min-[1400px]:p-[2.125rem]"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="flex flex-col gap-[1.375rem]">
            <Eyebrow className="bg-accent text-accent-foreground">GOOD TO KNOW</Eyebrow>
            <h2 id="ordering-heading" className="type-h2">
              ORDERING +
              <br /> DELIVERY
            </h2>
          </div>
          <div className="mt-12 flex flex-col gap-3">
            <span aria-hidden="true" className="h-2 w-21 bg-accent" />
            <p>A few helpful details before you make a request.</p>
          </div>
        </motion.div>

        <ol className="flex flex-1 flex-col">
          {essentials.map((item, index) => (
            <motion.li
              key={item.title}
              className={cn(
                "flex min-h-[9.75rem] items-center gap-5 border-t border-border py-[1.125rem]",
                index === essentials.length - 1 && "border-b"
              )}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.span
                className={cn(
                  "flex size-14 shrink-0 items-center justify-center rounded-pill border border-border font-display text-lg min-[1400px]:size-[4.5rem] min-[1400px]:text-[1.375rem]",
                  index === 0 && "bg-info",
                  index === 1 && "bg-accent",
                  index === 2 && "bg-card"
                )}
                initial={{ scale: 0.85 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", visualDuration: 0.35, bounce: 0.12, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                {String(index + 1).padStart(2, "0")}
              </motion.span>
              <div className="flex min-w-0 flex-col gap-2">
                <p className="text-[0.6875rem] leading-3.5 font-extrabold tracking-label text-primary">
                  {item.eyebrow}
                </p>
                <h3 className="font-display text-2xl leading-7 min-[1400px]:text-[1.875rem] min-[1400px]:leading-[2.125rem]">
                  {item.title}
                </h3>
                <p className="text-[0.9375rem] leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </Container>
    </section>
  )
}

export { OrderingEssentials }
