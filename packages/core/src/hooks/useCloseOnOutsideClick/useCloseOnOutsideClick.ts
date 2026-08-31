import { useEffect, type RefObject } from "react";

export type AutoClose = "outside" | "inside" | true | false;

export function useCloseOnOutsideClick(
  enabled: boolean,
  panelRef: RefObject<HTMLElement | null>,
  onClose: () => void,
  opts?: {
    togglerRef?: RefObject<HTMLElement | null>;
    mode?: AutoClose;
  },
): void {
  const mode = opts?.mode ?? "outside";
  const togglerRef = opts?.togglerRef;

  useEffect(() => {
    if (!enabled || mode === false) return;

    const handler = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      const panel = panelRef.current;
      if (!panel) return;
      const toggler = togglerRef?.current ?? null;
      const inPanel = Boolean(panel?.contains(target));
      const inToggler = Boolean(toggler?.contains(target));

      let shouldClose = false;
      if (mode === "outside") shouldClose = !inPanel && !inToggler;
      else if (mode === "inside") shouldClose = inPanel;
      else if (mode === true) shouldClose = !inToggler;
      if (shouldClose) onClose();
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [enabled, panelRef, onClose, mode, togglerRef]);
}
