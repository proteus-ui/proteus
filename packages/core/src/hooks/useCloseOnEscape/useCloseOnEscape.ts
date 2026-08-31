import { useEffect } from "react";
import { KEYBOARD_KEYS } from "../../utils/keyboard";
import { KEYDOWN_EVENT } from "./consts";

export function useCloseOnEscape(enabled: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === KEYBOARD_KEYS.ESCAPE) onClose();
    };
    document.addEventListener(KEYDOWN_EVENT, handler);
    return () => document.removeEventListener(KEYDOWN_EVENT, handler);
  }, [enabled, onClose]);
}
