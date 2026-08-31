import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EntitySelector } from "../../index";

describe("EntitySelector", () => {
  it("selects a suggestion and reports the entity", async () => {
    const onEntitySelect = vi.fn();
    render(
      <EntitySelector
        label="User"
        suggestions={[{ value: "u1", label: "Ada", data: { id: "u1" } }]}
        onEntitySelect={onEntitySelect}
      />,
    );
    await userEvent.type(screen.getByRole("combobox"), "Ad");
    await userEvent.click(screen.getByRole("option", { name: "Ada" }));
    expect(onEntitySelect).toHaveBeenCalledWith({ value: "u1", label: "Ada", data: { id: "u1" } });
  });
});
