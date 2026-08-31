import { useEffect, type RefObject } from "react";
import { AUTO_CLOSE_DEFAULT, CLICK_EVENT } from "./consts";
import type { UseCloseOnOutsideClickOptions } from "./types";
import { shouldCloseOnTarget } from "./utils";

export function useCloseOnOutsideClick(
  enabled: boolean,
  panelRef: RefObject<HTMLElement | null>,
  onClose: () => void,
  opts?: UseCloseOnOutsideClickOptions,
): void {
  const mode = opts?.mode ?? AUTO_CLOSE_DEFAULT;
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
      if (shouldCloseOnTarget(mode, inPanel, inToggler)) onClose();
    };

    document.addEventListener(CLICK_EVENT, handler, true);
    return () => document.removeEventListener(CLICK_EVENT, handler, true);
  }, [enabled, panelRef, onClose, mode, togglerRef]);
}
