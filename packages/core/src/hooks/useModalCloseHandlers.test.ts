import { createRef } from "react";
import { fireEvent, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useModalCloseHandlers } from "./useModalCloseHandlers";

describe("useModalCloseHandlers", () => {
  it("closes on Escape and outside click when enabled", () => {
    const onClose = vi.fn();
    const panel = document.createElement("div");
    const outside = document.createElement("button");
    document.body.append(panel, outside);
    const panelRef = createRef<HTMLElement | null>();
    panelRef.current = panel;

    renderHook(() => useModalCloseHandlers(true, panelRef, onClose));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.mouseDown(outside);
    expect(onClose).toHaveBeenCalledTimes(2);

    panel.remove();
    outside.remove();
  });

  it("does not close when disabled", () => {
    const onClose = vi.fn();
    const panel = document.createElement("div");
    const outside = document.createElement("button");
    document.body.append(panel, outside);
    const panelRef = createRef<HTMLElement | null>();
    panelRef.current = panel;

    renderHook(() => useModalCloseHandlers(false, panelRef, onClose));
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.mouseDown(outside);
    expect(onClose).not.toHaveBeenCalled();

    panel.remove();
    outside.remove();
  });
});
