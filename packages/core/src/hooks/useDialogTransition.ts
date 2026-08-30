import { useEffect, useState, type RefObject } from "react";
import { getTransitionDurationMs } from "../utils/transition";

export type DialogPhase = "open" | "closed";

// Two-phase mount/visibility: separates user intent (`open`) from the
// transition phase exposed as `data-state`. Enter: mount → rAF → "open".
// Exit: "closed" → unmount after the element's own CSS transition duration.
export function useDialogTransition(
  open: boolean,
  ref: RefObject<HTMLElement | null>,
): { mounted: boolean; phase: DialogPhase } {
  const [mounted, setMounted] = useState(open);
  const [phase, setPhase] = useState<DialogPhase>(open ? "open" : "closed");

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setPhase("open"));
      return () => cancelAnimationFrame(raf);
    }
    setPhase("closed");
    const timeout = window.setTimeout(
      () => setMounted(false),
      getTransitionDurationMs(ref.current),
    );
    return () => window.clearTimeout(timeout);
  }, [open, ref]);

  return { mounted, phase };
}
