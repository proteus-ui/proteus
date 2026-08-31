import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CollapsibleSection } from "../index";

const items = [
  { id: "a", title: "A", children: "Panel A", defaultOpen: true },
  { id: "b", title: "B", children: "Panel B" },
];

describe("CollapsibleSection", () => {
  it("single: opening B closes A; clicking open A closes A", async () => {
    render(<CollapsibleSection items={items} />);
    expect(screen.getByText("Panel A")).toBeVisible();
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(screen.getByRole("button", { name: "B" }));
    expect(screen.queryByText("Panel A")).not.toBeVisible();
    expect(screen.getByText("Panel B")).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "B" }));
    expect(screen.queryByText("Panel B")).not.toBeVisible();
  });

  it("multiple: A and B can both be open", async () => {
    render(<CollapsibleSection mode="multiple" items={items} />);
    await userEvent.click(screen.getByRole("button", { name: "B" }));
    expect(screen.getByText("Panel A")).toBeVisible();
    expect(screen.getByText("Panel B")).toBeVisible();
  });

  it("closed panel is hidden and aria-expanded tracks state", () => {
    render(<CollapsibleSection items={[{ id: "a", title: "A", children: "Panel A" }]} />);
    const trigger = screen.getByRole("button", { name: "A" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("accordion-panel-a")).toHaveAttribute("hidden");
    expect(document.getElementById("accordion-panel-a")).toHaveAttribute("data-state", "closed");
  });
});
