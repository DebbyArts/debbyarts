import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import type { RequestPageData } from "@/features/enquiries/request-types"

const { submitEnquiryAction } = vi.hoisted(() => ({
  submitEnquiryAction: vi.fn(),
}))

vi.mock("@/features/enquiries/actions", () => ({ submitEnquiryAction }))

import { RequestFlow } from "@/features/enquiries/components/request-flow"

class ResizeObserverMock {
  disconnect() {}
  observe() {}
  unobserve() {}
}

const artCommissionData: RequestPageData = {
  artworks: [],
  services: [],
  initialContext: {
    mode: "art-commission",
    kind: "ARTWORK",
    itemSlug: null,
  },
  status: "ready",
}

const defaultData: RequestPageData = {
  artworks: [],
  services: [],
  initialContext: { mode: "default", kind: null, itemSlug: null },
  status: "ready",
}

function completeBroadRequest() {
  fireEvent.change(
    screen.getByRole("textbox", {
      name: "Tell us what you have in mind (optional)",
    }),
    { target: { value: "A family portrait commission." } }
  )
  fireEvent.click(screen.getByRole("button", { name: "Next →" }))
  fireEvent.click(screen.getByRole("radio", { name: "Pickup" }))
  fireEvent.click(screen.getByRole("button", { name: "Next →" }))
  fireEvent.change(screen.getByRole("textbox", { name: "Name" }), {
    target: { value: "Ada Okafor" },
  })
  fireEvent.change(screen.getByRole("textbox", { name: "Phone / WhatsApp" }), {
    target: { value: "0814 123 4567" },
  })
}

describe("RequestFlow accessibility and retry state", () => {
  beforeEach(() => {
    submitEnquiryAction.mockReset()
    globalThis.ResizeObserver = ResizeObserverMock
  })

  afterEach(cleanup)

  test("associates required selection errors with the radio group", () => {
    render(<RequestFlow data={defaultData} />)

    const group = screen.getByRole("radiogroup")
    expect(group.getAttribute("aria-required")).toBe("true")

    fireEvent.click(screen.getByRole("button", { name: "Next →" }))

    const error = screen.getByText("Choose Art & Gallery or Services.")
    expect(error.id).toBe("request-kind-error")
    expect(group.getAttribute("aria-describedby")).toBe(error.id)
  })

  test("keeps completed answers available after a failed save and retry", async () => {
    submitEnquiryAction
      .mockResolvedValueOnce({
        status: "error",
        message:
          "We couldn’t save your request. Your answers are still here, so you can try again.",
      })
      .mockResolvedValueOnce({
        status: "success",
        reference: "DAP-RETRY1234",
        whatsappUrl: "https://wa.me/2348141780805?text=retry",
        duplicate: false,
      })

    render(<RequestFlow data={artCommissionData} />)
    completeBroadRequest()

    expect(screen.getByRole("textbox", { name: "Name" }).hasAttribute("required")).toBe(true)
    expect(
      screen.getByRole("textbox", { name: "Phone / WhatsApp" }).hasAttribute("required")
    ).toBe(true)

    fireEvent.click(screen.getByRole("button", { name: "Submit request" }))
    expect(await screen.findByText("WE COULDN’T SUBMIT YOUR REQUEST")).toBeDefined()

    fireEvent.click(screen.getByRole("button", { name: "Review answers" }))
    expect(
      (screen.getByRole("textbox", { name: "Name" }) as HTMLInputElement).value
    ).toBe("Ada Okafor")
    expect(
      (screen.getByRole("textbox", { name: "Phone / WhatsApp" }) as HTMLInputElement)
        .value
    ).toBe("0814 123 4567")

    fireEvent.click(screen.getByRole("button", { name: "Submit request" }))
    expect(await screen.findByText("REQUEST RECEIVED")).toBeDefined()
    expect(submitEnquiryAction).toHaveBeenCalledTimes(2)
  })

  test("returns a server note error to the broad-request details field", async () => {
    submitEnquiryAction.mockResolvedValue({
      status: "validation",
      message: "Check the highlighted fields.",
      fieldErrors: { customerNote: "Keep the note under 2,000 characters." },
    })

    render(<RequestFlow data={artCommissionData} />)
    completeBroadRequest()
    fireEvent.click(screen.getByRole("button", { name: "Submit request" }))

    const note = await screen.findByRole("textbox", {
      name: "Tell us what you have in mind (optional)",
    })
    const error = screen.getByText("Keep the note under 2,000 characters.")

    expect((note as HTMLTextAreaElement).value).toBe("A family portrait commission.")
    expect(note.getAttribute("maxlength")).toBe("2000")
    expect(note.getAttribute("aria-describedby")).toContain(error.id)
    await waitFor(() => {
      expect(screen.getByText("Current step: Request details, 1 of 3.")).toBeDefined()
    })
  })
})
