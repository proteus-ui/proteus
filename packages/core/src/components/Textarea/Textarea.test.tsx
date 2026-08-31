import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Textarea } from "../../index";

describe("Textarea", () => {
  it("renders root + field slots", () => {
    render(<Textarea aria-label="notes" />);
    const field = screen.getByRole("textbox", { name: "notes" });
    expect(field).toHaveClass("pr-textarea__field");
    expect(field.parentElement).toHaveClass("pr-textarea");
  });

  it("fires onValueChange as the user types", async () => {
    const onValueChange = vi.fn();
    render(<Textarea aria-label="notes" onValueChange={onValueChange} />);
    await userEvent.type(screen.getByRole("textbox", { name: "notes" }), "hi");
    expect(onValueChange).toHaveBeenLastCalledWith("hi");
  });

  it("marks invalid via data-invalid and aria-invalid", () => {
    render(<Textarea aria-label="notes" invalid />);
    const field = screen.getByRole("textbox", { name: "notes" });
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field.parentElement).toHaveAttribute("data-invalid", "true");
  });
});
