import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Tooltip } from "../index";

describe("Tooltip", () => {
  it("shows role=tooltip on hover", async () => {
    render(
      <Tooltip content="Hint" delay={0}>
        <button type="button">Target</button>
      </Tooltip>,
    );
    expect(screen.queryByRole("tooltip")).toBeNull();
    await userEvent.tab();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Hint");
    expect(screen.getByRole("tooltip")).toHaveClass("pr-tooltip");
  });
});
