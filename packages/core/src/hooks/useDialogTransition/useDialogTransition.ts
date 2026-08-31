import { useEffect, useState, type RefObject } from "react";
import { getTransitionDurationMs } from "../../utils/transition";
import { DIALOG_PHASE } from "./consts";
import type { DialogPhase, UseDialogTransitionReturn } from "./types";

// Two-phase mount/visibility: separates user intent (`open`) from the
// transition phase exposed as `data-state`. Enter: mount → rAF → "open".
// Exit: "closed" → unmount after the element's own CSS transition duration.
export function useDialogTransition(
  open: boolean,
  ref: RefObject<HTMLElement | null>,
): UseDialogTransitionReturn {
  const [mounted, setMounted] = useState(open);
  const [phase, setPhase] = useState<DialogPhase>(open ? DIALOG_PHASE.Open : DIALOG_PHASE.Closed);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setPhase(DIALOG_PHASE.Open));
      return () => cancelAnimationFrame(raf);
    }
    setPhase(DIALOG_PHASE.Closed);
    const timeout = window.setTimeout(
      () => setMounted(false),
      getTransitionDurationMs(ref.current),
    );
    return () => window.clearTimeout(timeout);
  }, [open, ref]);

  return { mounted, phase };
}
