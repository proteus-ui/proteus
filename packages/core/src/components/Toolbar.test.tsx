import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Toolbar, ToolbarButton } from "../index";

describe("Toolbar", () => {
  it("exposes role=toolbar and pressed data on ToolbarButton", () => {
    render(
      <Toolbar>
        <ToolbarButton pressed>Bold</ToolbarButton>
      </Toolbar>,
    );
    expect(screen.getByRole("toolbar")).toHaveClass("pr-toolbar");
    const btn = screen.getByRole("button", { name: "Bold" });
    expect(btn).toHaveClass("pr-toolbar__button");
    expect(btn).toHaveAttribute("data-pressed", "true");
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });
});
