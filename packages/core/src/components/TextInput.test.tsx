import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TextInput } from "../index";

describe("TextInput", () => {
  it("renders root + input slots with pr- classes", () => {
    render(<TextInput aria-label="name" />);
    const input = screen.getByRole("textbox", { name: "name" });
    expect(input).toHaveClass("pr-input__field");
    expect(input.parentElement).toHaveClass("pr-input");
  });

  it("fires onValueChange as user types (uncontrolled)", async () => {
    const onValueChange = vi.fn();
    render(<TextInput aria-label="name" onValueChange={onValueChange} />);
    await userEvent.type(screen.getByRole("textbox", { name: "name" }), "hi");
    expect(onValueChange).toHaveBeenLastCalledWith("hi");
  });

  it("marks invalid state via data-invalid + aria-invalid", () => {
    render(<TextInput aria-label="name" invalid />);
    const input = screen.getByRole("textbox", { name: "name" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.parentElement).toHaveAttribute("data-invalid", "true");
  });
});
