import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TimeInput } from "../../index";

describe("TimeInput", () => {
  it("keeps valid HH:MM and reverts invalid on blur", async () => {
    render(<TimeInput defaultValue="09:30" />);
    const input = screen.getByRole("textbox");
    await userEvent.clear(input);
    await userEvent.type(input, "25:99");
    await userEvent.tab();
    expect(input).toHaveValue("09:30");
    await userEvent.clear(input);
    await userEvent.type(input, "18:05");
    await userEvent.tab();
    expect(input).toHaveValue("18:05");
  });
});
