import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "../../index";

describe("Card", () => {
  it("renders article.pr-card with Title, Body, Footer slots", () => {
    render(
      <Card classNames={{ root: "r", header: "h", body: "b", footer: "f" }}>
        <Card.Title>Title</Card.Title>
        <Card.Body>Body</Card.Body>
        <Card.Footer>Foot</Card.Footer>
      </Card>,
    );
    const root = screen.getByRole("article");
    expect(root).toHaveClass("pr-card", "r");
    expect(screen.getByText("Title")).toHaveClass("pr-card__header", "h");
    expect(screen.getByText("Body")).toHaveClass("pr-card__body", "b");
    expect(screen.getByText("Foot")).toHaveClass("pr-card__footer", "f");
  });

  it("rejects non-slot direct children", () => {
    expect(() =>
      render(
        <Card>
          {/* eslint-disable-next-line @proteus-ui/compound-slots -- runtime guard */}
          <div>nope</div>
        </Card>,
      ),
    ).toThrow(/Card direct children must be slot elements/);
  });
});
