import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NumberStepper } from "../index";

describe("NumberStepper", () => {
  it("inc/dec clamp and keyboard steps", async () => {
    const onValueChange = vi.fn();
    render(<NumberStepper defaultValue={1} min={0} max={3} step={1} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Increase value" }));
    expect(onValueChange).toHaveBeenLastCalledWith(2);
    const input = screen.getByRole("spinbutton");
    input.focus();
    await userEvent.keyboard("{ArrowUp}{ArrowUp}");
    expect(onValueChange).toHaveBeenLastCalledWith(3);
    await userEvent.click(screen.getByRole("button", { name: "Increase value" }));
    expect(onValueChange).toHaveBeenLastCalledWith(3);
  });

  it("does not commit 0 while the field is cleared", async () => {
    const onValueChange = vi.fn();
    render(<NumberStepper defaultValue={2} onValueChange={onValueChange} />);
    const input = screen.getByRole("spinbutton");
    await userEvent.clear(input);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(input).toHaveValue("");
  });

  it("keeps intermediate minus and decimal drafts until blur", async () => {
    const onValueChange = vi.fn();
    render(<NumberStepper defaultValue={0} min={-10} step={0.1} onValueChange={onValueChange} />);
    const input = screen.getByRole("spinbutton");
    await userEvent.clear(input);
    await userEvent.type(input, "-");
    expect(input).toHaveValue("-");
    expect(onValueChange).not.toHaveBeenCalled();
    await userEvent.type(input, "1.5");
    expect(input).toHaveValue("-1.5");
    await userEvent.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(-1.5);
  });

  it("steps from the typed draft in one commit", async () => {
    const onValueChange = vi.fn();
    render(<NumberStepper defaultValue={1} onValueChange={onValueChange} />);
    const input = screen.getByRole("spinbutton");
    await userEvent.clear(input);
    await userEvent.type(input, "5");
    await userEvent.click(screen.getByRole("button", { name: "Increase value" }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenLastCalledWith(6);
  });

  it("preserves a fractional value when stepping by an integer", async () => {
    const onValueChange = vi.fn();
    render(<NumberStepper defaultValue={1.5} step={1} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Increase value" }));
    expect(onValueChange).toHaveBeenLastCalledWith(2.5);
  });

  it("avoids float drift when stepping by 0.1", async () => {
    const onValueChange = vi.fn();
    render(<NumberStepper defaultValue={0.1} step={0.1} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Increase value" }));
    await userEvent.click(screen.getByRole("button", { name: "Increase value" }));
    expect(onValueChange).toHaveBeenLastCalledWith(0.3);
  });
});
