import type { DialogPhase } from "./types";

export const DIALOG_PHASE = {
  Open: "open",
  Closed: "closed",
} as const satisfies Record<string, DialogPhase>;
