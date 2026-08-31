import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "../index";

describe("Card", () => {
  it("renders article.pr-card with header, body, footer slots", () => {
    render(
      <Card title="Title" footer="Foot" classNames={{ root: "r", header: "h", body: "b", footer: "f" }}>
        Body
      </Card>,
    );
    const root = screen.getByRole("article");
    expect(root).toHaveClass("pr-card", "r");
    expect(screen.getByText("Title")).toHaveClass("pr-card__header", "h");
    expect(screen.getByText("Body")).toHaveClass("pr-card__body", "b");
    expect(screen.getByText("Foot")).toHaveClass("pr-card__footer", "f");
  });
});
