import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LinkCard } from "../../index";

describe("LinkCard", () => {
  it("renders an anchor with pr-link-card and href", () => {
    render(
      <LinkCard href="/x" title="Go">
        Desc
      </LinkCard>,
    );
    const a = screen.getByRole("link", { name: /Go/ });
    expect(a).toHaveClass("pr-link-card");
    expect(a).toHaveAttribute("href", "/x");
    expect(screen.getByText("Go")).toHaveClass("pr-link-card__title");
    expect(screen.getByText("Desc")).toHaveClass("pr-link-card__body");
  });
});
