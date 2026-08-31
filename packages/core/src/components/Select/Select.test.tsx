import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from "../../index";

const options = [
  { value: "pl", label: "Poland" },
  { value: "de", label: "Germany" },
];

describe("Select", () => {
  it("opens via toggle and selects by option value", async () => {
    const onValueChange = vi.fn();
    render(<Select options={options} onValueChange={onValueChange} label="Country" />);
    await userEvent.click(screen.getByRole("button", { name: "Open suggestions" }));
    await userEvent.click(screen.getByRole("option", { name: "Germany" }));
    expect(onValueChange).toHaveBeenCalledWith("de");
    expect(screen.getByRole("combobox")).toHaveValue("Germany");
  });

  it("types a filter without changing the selected option id", async () => {
    const onValueChange = vi.fn();
    render(<Select options={options} defaultValue="pl" onValueChange={onValueChange} label="Country" />);
    const input = screen.getByRole("combobox");
    expect(input).toHaveValue("Poland");
    await userEvent.clear(input);
    await userEvent.type(input, "Ger");
    expect(input).toHaveValue("Ger");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("option", { name: "Germany" })).toBeInTheDocument();
  });

  it("filters the list to labels that include the typed query", async () => {
    render(<Select options={options} label="Country" />);
    await userEvent.type(screen.getByRole("combobox"), "ger");
    expect(screen.getByRole("option", { name: "Germany" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Poland" })).toBeNull();
  });

  it("shows the full list when opened via toggle after a selection", async () => {
    render(<Select options={options} defaultValue="pl" label="Country" />);
    await userEvent.click(screen.getByRole("button", { name: "Open suggestions" }));
    expect(screen.getByRole("option", { name: "Poland" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Germany" })).toBeInTheDocument();
  });

  it("clears the selected value via Clear search", async () => {
    const onValueChange = vi.fn();
    render(<Select options={options} defaultValue="pl" onValueChange={onValueChange} label="Country" />);
    expect(screen.getByRole("combobox")).toHaveValue("Poland");
    await userEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getByRole("combobox")).toHaveValue("");
    expect(onValueChange).toHaveBeenCalledWith("");
  });

  it("ArrowDown then Enter selects the highlighted option", async () => {
    const onValueChange = vi.fn();
    render(<Select options={options} onValueChange={onValueChange} label="Country" />);
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("pl");
    expect(input).toHaveValue("Poland");
  });

  it("Escape closes the list", async () => {
    render(<Select options={options} label="Country" />);
    await userEvent.click(screen.getByRole("button", { name: "Open suggestions" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("outside click closes the list", async () => {
    render(
      <>
        <Select options={options} label="Country" />
        <button type="button">Away</button>
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Open suggestions" }));
    await userEvent.click(screen.getByRole("button", { name: "Away" }));
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("announces matches while typing a filter", async () => {
    render(<Select options={options} label="Country" />);
    await userEvent.type(screen.getByRole("combobox"), "ger");
    expect(screen.getByRole("status", { name: "" })).toHaveTextContent("1 suggestion available");
  });

  it("shows no-results status when the filter matches nothing", async () => {
    render(<Select options={options} label="Country" />);
    await userEvent.type(screen.getByRole("combobox"), "zzz");
    expect(screen.getAllByRole("status").some((el) => el.textContent === "No results found")).toBe(
      true,
    );
  });

  it("disabled: input disabled and no clear or toggle", () => {
    render(<Select options={options} defaultValue="pl" disabled label="Country" />);
    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull();
    expect(screen.queryByRole("button", { name: /suggestions/ })).toBeNull();
  });
});
