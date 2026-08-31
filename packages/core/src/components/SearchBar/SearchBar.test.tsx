import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "../../index";

describe("SearchBar", () => {
  it("shows a clear button only when there is a value and clears on click", async () => {
    const onValueChange = vi.fn();
    const onClear = vi.fn();
    render(
      <SearchBar aria-label="search" defaultValue="abc" onValueChange={onValueChange} onClear={onClear} />,
    );
    const clear = screen.getByRole("button", { name: /clear/i });
    await userEvent.click(clear);
    expect(onValueChange).toHaveBeenLastCalledWith("");
    expect(onClear).toHaveBeenCalled();
  });

  it("hides the clear button when empty", () => {
    render(<SearchBar aria-label="search" defaultValue="" />);
    expect(screen.queryByRole("button", { name: /clear/i })).toBeNull();
  });

  it("hides clear button and emits data-disabled when disabled", () => {
    render(<SearchBar aria-label="search" defaultValue="abc" disabled />);
    expect(screen.queryByRole("button", { name: /clear/i })).toBeNull();
    const root = document.querySelector(".pr-search");
    expect(root).toHaveAttribute("data-disabled", "true");
    expect(root).not.toHaveAttribute("data-readonly");
  });

  it("hides clear button and emits data-readonly when readOnly", () => {
    render(<SearchBar aria-label="search" defaultValue="abc" readOnly />);
    expect(screen.queryByRole("button", { name: /clear/i })).toBeNull();
    const root = document.querySelector(".pr-search");
    expect(root).toHaveAttribute("data-readonly", "true");
    expect(root).not.toHaveAttribute("data-disabled");
  });
});
