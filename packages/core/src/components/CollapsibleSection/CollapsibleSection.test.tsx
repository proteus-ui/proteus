import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CollapsibleSection } from "../../index";

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

  it("items-sync: removing an open id drops that panel and keeps remaining open ids", () => {
    const bothOpen = [
      { id: "a", title: "A", children: "Panel A", defaultOpen: true },
      { id: "b", title: "B", children: "Panel B", defaultOpen: true },
    ];
    const { rerender } = render(<CollapsibleSection mode="multiple" items={bothOpen} />);
    expect(screen.getByText("Panel A")).toBeVisible();
    expect(screen.getByText("Panel B")).toBeVisible();
    rerender(
      <CollapsibleSection
        mode="multiple"
        items={[{ id: "b", title: "B", children: "Panel B", defaultOpen: true }]}
      />,
    );
    expect(screen.queryByText("Panel A")).not.toBeInTheDocument();
    expect(screen.getByText("Panel B")).toBeVisible();
  });

  it("items-sync: adding an item with defaultOpen opens it (uncontrolled)", () => {
    const { rerender } = render(
      <CollapsibleSection
        mode="multiple"
        items={[{ id: "a", title: "A", children: "Panel A", defaultOpen: true }]}
      />,
    );
    expect(screen.getByText("Panel A")).toBeVisible();
    rerender(
      <CollapsibleSection
        mode="multiple"
        items={[
          { id: "a", title: "A", children: "Panel A", defaultOpen: true },
          { id: "b", title: "B", children: "Panel B", defaultOpen: true },
        ]}
      />,
    );
    expect(screen.getByText("Panel A")).toBeVisible();
    expect(screen.getByText("Panel B")).toBeVisible();
  });

  it("items-sync: controlled openIds ignores item defaultOpen changes", () => {
    const { rerender } = render(
      <CollapsibleSection
        mode="multiple"
        openIds={["a"]}
        items={[
          { id: "a", title: "A", children: "Panel A" },
          { id: "b", title: "B", children: "Panel B" },
        ]}
      />,
    );
    expect(screen.getByText("Panel A")).toBeVisible();
    expect(screen.queryByText("Panel B")).not.toBeVisible();
    rerender(
      <CollapsibleSection
        mode="multiple"
        openIds={["a"]}
        items={[
          { id: "a", title: "A", children: "Panel A" },
          { id: "b", title: "B", children: "Panel B", defaultOpen: true },
          { id: "c", title: "C", children: "Panel C", defaultOpen: true },
        ]}
      />,
    );
    expect(screen.getByText("Panel A")).toBeVisible();
    expect(screen.queryByText("Panel B")).not.toBeVisible();
    expect(screen.queryByText("Panel C")).not.toBeVisible();
  });
});
