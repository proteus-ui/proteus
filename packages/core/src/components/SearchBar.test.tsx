import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "../index";

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
});
