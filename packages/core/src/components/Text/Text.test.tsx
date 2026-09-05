import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Text, TextH1 } from "../../index";

describe("Text", () => {
  it("renders h1.pr-text with data-tag=h1", () => {
    render(<Text.H1>Title</Text.H1>);
    const el = screen.getByRole("heading", { level: 1, name: "Title" });
    expect(el.tagName).toBe("H1");
    expect(el).toHaveClass("pr-text");
    expect(el).toHaveAttribute("data-tag", "h1");
  });

  it("merges classNames.root and className", () => {
    render(
      <Text.P className="c" classNames={{ root: "r" }}>
        Body
      </Text.P>,
    );
    expect(screen.getByText("Body")).toHaveClass("pr-text", "r", "c");
  });

  it("preserves href on Text.A", () => {
    render(<Text.A href="/x">link</Text.A>);
    expect(screen.getByRole("link", { name: "link" })).toHaveAttribute("href", "/x");
  });

  it("renders br without children", () => {
    const { container } = render(<Text.Br />);
    const br = container.querySelector("br");
    expect(br).not.toBeNull();
    expect(br).toHaveClass("pr-text");
    expect(br).toHaveAttribute("data-tag", "br");
    expect(br?.childNodes).toHaveLength(0);
  });

  it("is a namespace, not a component", () => {
    expect(typeof Text).not.toBe("function");
  });

  it("standalone TextH1 is the same function as Text.H1", () => {
    expect(TextH1).toBe(Text.H1);
  });
});
