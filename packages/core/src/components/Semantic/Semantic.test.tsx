import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Semantic, SemanticMain } from "../../index";

describe("Semantic", () => {
  it("renders main.pr-semantic with data-tag=main", () => {
    render(<Semantic.Main>Content</Semantic.Main>);
    const el = screen.getByRole("main");
    expect(el.tagName).toBe("MAIN");
    expect(el).toHaveClass("pr-semantic");
    expect(el).toHaveAttribute("data-tag", "main");
    expect(el).toHaveTextContent("Content");
  });

  it("merges classNames.root and className", () => {
    render(
      <Semantic.Header className="c" classNames={{ root: "r" }}>
        Top
      </Semantic.Header>,
    );
    expect(screen.getByText("Top")).toHaveClass("pr-semantic", "r", "c");
    expect(screen.getByText("Top").tagName).toBe("HEADER");
  });

  it("renders landmark tags with correct roles", () => {
    render(
      <>
        <Semantic.Nav aria-label="Primary">Nav</Semantic.Nav>
        <Semantic.Aside aria-label="Related">Aside</Semantic.Aside>
        <Semantic.Footer>Foot</Semantic.Footer>
        <Semantic.Article>Article</Semantic.Article>
        <Semantic.Section aria-label="Block">Section</Semantic.Section>
      </>,
    );
    expect(screen.getByRole("navigation", { name: "Primary" }).tagName).toBe("NAV");
    expect(screen.getByRole("complementary", { name: "Related" }).tagName).toBe("ASIDE");
    expect(screen.getByRole("contentinfo")).toHaveTextContent("Foot");
    expect(screen.getByRole("article")).toHaveTextContent("Article");
    expect(screen.getByRole("region", { name: "Block" }).tagName).toBe("SECTION");
  });

  it("Details / Summary form a native disclosure", async () => {
    render(
      <Semantic.Details>
        <Semantic.Summary>More</Semantic.Summary>
        <p>Hidden until open</p>
      </Semantic.Details>,
    );
    const details = document.querySelector("details");
    expect(details).toHaveClass("pr-semantic");
    expect(details).toHaveAttribute("data-tag", "details");
    expect(screen.getByText("More").tagName).toBe("SUMMARY");
    expect(details).not.toHaveAttribute("open");
    await userEvent.click(screen.getByText("More"));
    expect(details).toHaveAttribute("open");
  });

  it("is a namespace, not a component", () => {
    expect(typeof Semantic).not.toBe("function");
  });

  it("standalone SemanticMain is the same function as Semantic.Main", () => {
    expect(SemanticMain).toBe(Semantic.Main);
  });
});
