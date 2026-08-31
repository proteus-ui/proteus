import { useRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { useCloseOnOutsideClick } from "./useCloseOnOutsideClick";

function Probe({
  mode,
  onClose,
}: {
  mode?: "outside" | "inside" | true | false;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const togglerRef = useRef<HTMLButtonElement>(null);
  useCloseOnOutsideClick(true, panelRef, onClose, { togglerRef, mode });
  return (
    <div>
      <button ref={togglerRef} type="button">
        Toggle
      </button>
      <div ref={panelRef}>Panel</div>
      <button type="button">Outside</button>
    </div>
  );
}

function NullPanel({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  useCloseOnOutsideClick(true, panelRef, onClose);
  return <button type="button">Outside</button>;
}

describe("useCloseOnOutsideClick", () => {
  it("outside: closes on outside click, not on panel or toggler", async () => {
    const onClose = vi.fn();
    render(<Probe mode="outside" onClose={onClose} />);
    await userEvent.click(screen.getByText("Panel"));
    await userEvent.click(screen.getByRole("button", { name: "Toggle" }));
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Outside" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("inside: closes only on panel click", async () => {
    const onClose = vi.fn();
    render(<Probe mode="inside" onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Outside" }));
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(screen.getByText("Panel"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("true: closes on inside or outside, not on toggler", async () => {
    const onClose = vi.fn();
    render(<Probe mode={true} onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Toggle" }));
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(screen.getByText("Panel"));
    expect(onClose).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole("button", { name: "Outside" }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("false: never attaches", async () => {
    const onClose = vi.fn();
    render(<Probe mode={false} onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Outside" }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not close when the panel is unmounted", async () => {
    const onClose = vi.fn();
    render(<NullPanel onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Outside" }));
    expect(onClose).not.toHaveBeenCalled();
  });
});
