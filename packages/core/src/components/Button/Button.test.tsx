import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button, IconButton } from "../../index";

describe("Button", () => {
  it("renders the pr-button root class and default data attributes", () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole("button", { name: "Save" });
    expect(btn).toHaveClass("pr-button");
    expect(btn).toHaveAttribute("data-intent", "neutral");
    expect(btn).toHaveAttribute("data-size", "md");
    expect(btn).toHaveAttribute("data-variant", "solid");
    expect(btn).not.toHaveAttribute("data-disabled");
  });

  it("reflects intent, size, and disabled as data-* attributes", () => {
    render(
      <Button intent="danger" size="sm" disabled>
        Delete
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Delete" });
    expect(btn).toHaveAttribute("data-intent", "danger");
    expect(btn).toHaveAttribute("data-size", "sm");
    expect(btn).toHaveAttribute("data-disabled", "true");
    expect(btn).toBeDisabled();
  });

  it("merges consumer classNames into the correct slots", () => {
    render(
      <Button icon={<svg data-testid="i" />} classNames={{ root: "my-root", icon: "my-icon" }}>
        Go
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Go" });
    expect(btn).toHaveClass("pr-button", "my-root");
    expect(screen.getByTestId("i").parentElement).toHaveClass("pr-button__icon", "my-icon");
  });

  it("sets data-variant from the variant prop", () => {
    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button", { name: "Outline" })).toHaveAttribute("data-variant", "outline");
  });

  it("supports text variant", () => {
    render(<Button variant="text">Text</Button>);
    expect(screen.getByRole("button", { name: "Text" })).toHaveAttribute("data-variant", "text");
  });

  it("places icon before the label by default", () => {
    render(
      <Button icon={<svg data-testid="i" />}>
        Go
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Go" });
    expect(btn).toHaveAttribute("data-icon-placement", "prefix");
    expect(btn.firstElementChild).toContainElement(screen.getByTestId("i"));
  });

  it("places icon after the label when iconPlacement is suffix", () => {
    render(
      <Button icon={<svg data-testid="i" />} iconPlacement="suffix">
        Next
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Next" });
    expect(btn).toHaveAttribute("data-icon-placement", "suffix");
    expect(btn.lastElementChild).toContainElement(screen.getByTestId("i"));
  });

  it("IconButton renders the root slot", () => {
    render(<IconButton aria-label="star" icon={<svg />} />);
    expect(screen.getByRole("button", { name: "star" })).toHaveClass("pr-button");
  });
});
