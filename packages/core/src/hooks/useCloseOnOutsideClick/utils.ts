import { AUTO_CLOSE } from "./consts";
import type { AutoClose } from "./types";

export function shouldCloseOnTarget(
  mode: AutoClose,
  inPanel: boolean,
  inToggler: boolean,
): boolean {
  if (mode === AUTO_CLOSE.Outside) return !inPanel && !inToggler;
  if (mode === AUTO_CLOSE.Inside) return inPanel;
  if (mode === AUTO_CLOSE.Always) return !inToggler;
  return false;
}
