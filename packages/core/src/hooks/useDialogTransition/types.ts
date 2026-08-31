export type DialogPhase = "open" | "closed";

export interface UseDialogTransitionReturn {
  mounted: boolean;
  phase: DialogPhase;
}
