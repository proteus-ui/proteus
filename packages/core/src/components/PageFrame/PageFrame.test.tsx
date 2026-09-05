import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageFrame } from "../../index";

describe("PageFrame", () => {
  it("renders Header, Main, Footer slots", () => {
    render(
      <PageFrame>
        <PageFrame.Header>Top</PageFrame.Header>
        <PageFrame.Main>Page</PageFrame.Main>
        <PageFrame.Footer>Bottom</PageFrame.Footer>
      </PageFrame>,
    );
    expect(document.querySelector(".pr-page-frame")).not.toBeNull();
    expect(screen.getByText("Top")).toHaveClass("pr-page-frame__header");
    expect(screen.getByRole("main")).toHaveClass("pr-page-frame__main");
    expect(screen.getByText("Page")).toBeInTheDocument();
    expect(screen.getByText("Bottom")).toHaveClass("pr-page-frame__footer");
  });
});
