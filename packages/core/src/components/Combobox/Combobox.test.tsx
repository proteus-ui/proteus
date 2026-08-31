import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Combobox } from "../../index";

const suggestions = [
  { value: "1", label: "Ada" },
  { value: "2", label: "Alan" },
];

describe("Combobox", () => {
  it("closed: no listbox", () => {
    render(<Combobox suggestions={suggestions} />);
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("type >= minCharsToSearch shows list and announcer", async () => {
    render(<Combobox suggestions={suggestions} minCharsToSearch={2} />);
    await userEvent.type(screen.getByRole("combobox"), "Ad");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "" })).toHaveTextContent("2 suggestions available");
  });

  it("no results: announcer + visible status", async () => {
    render(<Combobox suggestions={[]} noResultsText="None" />);
    await userEvent.type(screen.getByRole("combobox"), "zz");
    expect(screen.getAllByRole("status").some((el) => el.textContent === "None")).toBe(true);
  });

  it("ArrowDown then Enter selects", async () => {
    const onSelect = vi.fn();
    render(<Combobox suggestions={suggestions} onSuggestionSelect={onSelect} />);
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "Ad");
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenCalledWith(suggestions[0]);
    expect(input).toHaveValue("Ada");
  });

  it("Escape closes", async () => {
    render(<Combobox suggestions={suggestions} />);
    await userEvent.type(screen.getByRole("combobox"), "Ad");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("outside click closes", async () => {
    render(
      <>
        <Combobox suggestions={suggestions} />
        <button type="button">Away</button>
      </>,
    );
    await userEvent.type(screen.getByRole("combobox"), "Ad");
    await userEvent.click(screen.getByRole("button", { name: "Away" }));
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("clear empties and refocuses", async () => {
    render(<Combobox defaultValue="Ada" suggestions={suggestions} />);
    const input = screen.getByRole("combobox");
    await userEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
  });

  it("onlyDigits strips letters", async () => {
    render(<Combobox onlyDigits />);
    await userEvent.type(screen.getByRole("combobox"), "12ab3");
    expect(screen.getByRole("combobox")).toHaveValue("123");
  });

  it("loading hides list", async () => {
    render(<Combobox isLoading suggestions={suggestions} defaultValue="Ad" />);
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(screen.getByRole("status", { name: "Loading suggestions" })).toBeInTheDocument();
  });

  it("disabled: no clear/toggle, input disabled", () => {
    render(
      <Combobox disabled defaultValue="x" suggestions={suggestions} toggleIcon={<span>v</span>} />,
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull();
    expect(screen.queryByRole("button", { name: /suggestions/ })).toBeNull();
  });

  it("blur does not close", async () => {
    render(<Combobox suggestions={suggestions} />);
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "Ad");
    input.blur();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });
});
