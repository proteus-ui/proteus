import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CollapsibleSection } from "../../index";

function item(id: string, title: string, panel: ReactNode, defaultOpen?: boolean) {
  return (
    <CollapsibleSection.Item key={id} id={id} defaultOpen={defaultOpen}>
      <CollapsibleSection.Title>{title}</CollapsibleSection.Title>
      <CollapsibleSection.Panel>{panel}</CollapsibleSection.Panel>
    </CollapsibleSection.Item>
  );
}

describe("CollapsibleSection", () => {
  it("single: opening B closes A; clicking open A closes A", async () => {
    render(
      <CollapsibleSection>
        {item("a", "A", "Panel A", true)}
        {item("b", "B", "Panel B")}
      </CollapsibleSection>,
    );
    expect(screen.getByText("Panel A")).toBeVisible();
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(screen.getByRole("button", { name: "B" }));
    expect(screen.queryByText("Panel A")).not.toBeVisible();
    expect(screen.getByText("Panel B")).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "B" }));
    expect(screen.queryByText("Panel B")).not.toBeVisible();
  });

  it("multiple: A and B can both be open", async () => {
    render(
      <CollapsibleSection mode="multiple">
        {item("a", "A", "Panel A", true)}
        {item("b", "B", "Panel B")}
      </CollapsibleSection>,
    );
    await userEvent.click(screen.getByRole("button", { name: "B" }));
    expect(screen.getByText("Panel A")).toBeVisible();
    expect(screen.getByText("Panel B")).toBeVisible();
  });

  it("closed panel is hidden and aria-expanded tracks state", () => {
    render(<CollapsibleSection>{item("a", "A", "Panel A")}</CollapsibleSection>);
    const trigger = screen.getByRole("button", { name: "A" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("accordion-panel-a")).toHaveAttribute("hidden");
    expect(document.getElementById("accordion-panel-a")).toHaveAttribute("data-state", "closed");
  });

  it("items-sync: removing an open id drops that panel and keeps remaining open ids", () => {
    const { rerender } = render(
      <CollapsibleSection mode="multiple">
        {item("a", "A", "Panel A", true)}
        {item("b", "B", "Panel B", true)}
      </CollapsibleSection>,
    );
    expect(screen.getByText("Panel A")).toBeVisible();
    expect(screen.getByText("Panel B")).toBeVisible();
    rerender(
      <CollapsibleSection mode="multiple">{item("b", "B", "Panel B", true)}</CollapsibleSection>,
    );
    expect(screen.queryByText("Panel A")).not.toBeInTheDocument();
    expect(screen.getByText("Panel B")).toBeVisible();
  });

  it("items-sync: adding an item with defaultOpen opens it (uncontrolled)", () => {
    const { rerender } = render(
      <CollapsibleSection mode="multiple">{item("a", "A", "Panel A", true)}</CollapsibleSection>,
    );
    expect(screen.getByText("Panel A")).toBeVisible();
    rerender(
      <CollapsibleSection mode="multiple">
        {item("a", "A", "Panel A", true)}
        {item("b", "B", "Panel B", true)}
      </CollapsibleSection>,
    );
    expect(screen.getByText("Panel A")).toBeVisible();
    expect(screen.getByText("Panel B")).toBeVisible();
  });

  it("items-sync: controlled openIds ignores item defaultOpen changes", () => {
    const { rerender } = render(
      <CollapsibleSection mode="multiple" openIds={["a"]}>
        {item("a", "A", "Panel A")}
        {item("b", "B", "Panel B")}
      </CollapsibleSection>,
    );
    expect(screen.getByText("Panel A")).toBeVisible();
    expect(screen.queryByText("Panel B")).not.toBeVisible();
    rerender(
      <CollapsibleSection mode="multiple" openIds={["a"]}>
        {item("a", "A", "Panel A")}
        {item("b", "B", "Panel B", true)}
        {item("c", "C", "Panel C", true)}
      </CollapsibleSection>,
    );
    expect(screen.getByText("Panel A")).toBeVisible();
    expect(screen.queryByText("Panel B")).not.toBeVisible();
    expect(screen.queryByText("Panel C")).not.toBeVisible();
  });
});
