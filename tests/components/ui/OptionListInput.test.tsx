import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { OptionListInput } from "@/components/ui/OptionListInput"

describe("OptionListInput", () => {
  afterEach(cleanup)

  it("serializes ordered options and lets owners add and remove them", () => {
    render(
      <form data-testid="options-form">
        <OptionListInput
          id="sizes"
          name="availableSizes"
          label="Sizes"
          defaultValue={["A3"]}
        />
      </form>
    )

    const input = screen.getByRole("textbox", { name: "Sizes" })
    fireEvent.change(input, { target: { value: "  A2  " } })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(screen.getAllByRole("listitem")).toHaveLength(2)
    expect(
      new FormData(screen.getByTestId("options-form") as HTMLFormElement).getAll(
        "availableSizes"
      )
    ).toEqual(["A3", "A2"])

    fireEvent.click(screen.getByRole("button", { name: "Remove A3" }))

    expect(
      new FormData(screen.getByTestId("options-form") as HTMLFormElement).getAll(
        "availableSizes"
      )
    ).toEqual(["A2"])

    fireEvent.click(screen.getByRole("button", { name: "Remove A2" }))
    expect(
      new FormData(screen.getByTestId("options-form") as HTMLFormElement).getAll(
        "availableSizes"
      )
    ).toEqual([])
  })

  it("does not add blank or duplicate options", () => {
    render(
      <OptionListInput
        id="framing"
        name="framingOptions"
        label="Framing options"
        defaultValue={["Black frame"]}
      />
    )

    const input = screen.getByRole("textbox", { name: "Framing options" })
    fireEvent.click(screen.getByRole("button", { name: "Add" }))
    expect(screen.getAllByRole("listitem")).toHaveLength(1)

    fireEvent.change(input, { target: { value: " Black frame " } })
    fireEvent.click(screen.getByRole("button", { name: "Add" }))

    expect(screen.getAllByRole("listitem")).toHaveLength(1)
    expect(screen.getByText("That option is already listed.")).toBeDefined()
  })
})
