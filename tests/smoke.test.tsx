import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

test("component test harness renders content", () => {
  render(<div>Test harness ready</div>);

  expect(screen.getByText("Test harness ready")).toBeDefined();
});
