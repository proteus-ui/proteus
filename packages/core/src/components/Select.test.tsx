import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from "../index";

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
});
