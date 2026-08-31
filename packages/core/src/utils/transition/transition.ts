import { longestDurationMs } from "./utils";

export function getTransitionDurationMs(el: HTMLElement | null): number {
  if (!el || typeof window === "undefined") return 0;
  const style = window.getComputedStyle(el);
  return longestDurationMs(style.transitionDuration) + longestDurationMs(style.transitionDelay);
}
