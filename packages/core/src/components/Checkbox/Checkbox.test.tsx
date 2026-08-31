import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "../../index";

describe("Checkbox", () => {
  it("names the control from label and toggles on click", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Remote" onCheckedChange={onCheckedChange} />);
    const input = screen.getByRole("checkbox", { name: "Remote" });
    expect(input).not.toBeChecked();
    await userEvent.click(input);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(input).toBeChecked();
  });

  it("honors defaultChecked when uncontrolled", () => {
    render(<Checkbox label="Remote" defaultChecked />);
    expect(screen.getByRole("checkbox", { name: "Remote" })).toBeChecked();
  });

  it("marks invalid on the root and input", () => {
    render(<Checkbox label="Remote" invalid />);
    const input = screen.getByRole("checkbox", { name: "Remote" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.closest(".pr-checkbox")).toHaveAttribute("data-invalid", "true");
  });

  it("exposes indeterminate on the input", () => {
    render(<Checkbox label="All" indeterminate />);
    expect(screen.getByRole("checkbox", { name: "All" })).toHaveProperty("indeterminate", true);
  });
});
