import type { RefObject } from "react";
import { useCloseOnEscape } from "./useCloseOnEscape";
import { useCloseOnOutsideClick } from "./useCloseOnOutsideClick";

export function useModalCloseHandlers(
  enabled: boolean,
  panelRef: RefObject<HTMLElement | null>,
  onClose: () => void,
): void {
  useCloseOnEscape(enabled, onClose);
  useCloseOnOutsideClick(enabled, panelRef, onClose);
}
