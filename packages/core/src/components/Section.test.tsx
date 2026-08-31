import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section } from "../index";

describe("Section", () => {
  it("renders section.pr-section with title and body slots", () => {
    render(
      <Section title="Heading" classNames={{ root: "r", title: "t", body: "b" }}>
        Content
      </Section>,
    );
    const root = screen.getByRole("region", { name: "Heading" });
    expect(root).toHaveClass("pr-section", "r");
    expect(screen.getByText("Heading")).toHaveClass("pr-section__title", "t");
    expect(screen.getByText("Content")).toHaveClass("pr-section__body", "b");
  });
});
