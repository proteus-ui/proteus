import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Dialog } from "../../index";

describe("Dialog", () => {
  it("renders nothing when closed", () => {
    render(
      <Dialog open={false} onClose={() => {}} title="Confirm">
        body
      </Dialog>,
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders an accessible dialog with data-state and aria wiring when open", async () => {
    render(
      <Dialog open onClose={() => {}} title="Confirm" ariaDescribedBy="desc-1">
        <p id="desc-1">body</p>
      </Dialog>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName("Confirm");
    expect(dialog).toHaveAttribute("aria-describedby", "desc-1");
    await waitFor(() => expect(dialog).toHaveAttribute("data-state", "open"));
  });

  it("calls onClose on Escape", async () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="Confirm">
        body
      </Dialog>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the overlay is clicked but not the panel", async () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="Confirm">
        <button>inside</button>
      </Dialog>,
    );
    await userEvent.click(screen.getByRole("button", { name: "inside" }));
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(screen.getByTestId("pr-dialog-overlay"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("moves focus into the dialog on open and restores it to the trigger on close", async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>open</button>
          <Dialog open={open} onClose={() => setOpen(false)} title="Confirm">
            <button>inside</button>
          </Dialog>
        </>
      );
    }
    render(<Harness />);
    const trigger = screen.getByRole("button", { name: "open" });
    trigger.focus();
    await userEvent.click(trigger);
    await waitFor(() =>
      expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(true),
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});
