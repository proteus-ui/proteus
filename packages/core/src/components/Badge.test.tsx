import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge, Pill } from "../index";

describe("Badge", () => {
  it("renders pr-badge with default intent and badge variant", () => {
    render(<Badge>New</Badge>);
    const el = screen.getByText("New");
    expect(el).toHaveClass("pr-badge");
    expect(el).toHaveAttribute("data-intent", "neutral");
    expect(el).toHaveAttribute("data-variant", "badge");
  });

  it("Pill uses data-variant=pill and merges classNames.root", () => {
    render(
      <Pill intent="primary" classNames={{ root: "extra" }}>
        Hot
      </Pill>,
    );
    const el = screen.getByText("Hot");
    expect(el).toHaveClass("pr-badge", "extra");
    expect(el).toHaveAttribute("data-variant", "pill");
    expect(el).toHaveAttribute("data-intent", "primary");
  });
});
