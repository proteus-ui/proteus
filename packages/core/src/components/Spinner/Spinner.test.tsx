import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageLoader, Spinner } from "../../index";

describe("Spinner", () => {
  it("exposes status and size data", () => {
    render(<Spinner size="sm" />);
    const el = screen.getByRole("status", { name: "Loading" });
    expect(el).toHaveClass("pr-spinner");
    expect(el).toHaveAttribute("data-size", "sm");
  });

  it("PageLoader wraps a spinner", () => {
    render(<PageLoader label="Please wait" />);
    expect(document.querySelector(".pr-page-loader")).not.toBeNull();
    expect(screen.getByText("Please wait")).toBeVisible();
    expect(screen.getByRole("status", { name: "Please wait" })).toHaveClass("pr-page-loader");
  });
});
