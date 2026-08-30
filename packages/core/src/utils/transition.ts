export function getTransitionDurationMs(el: HTMLElement | null): number {
  if (!el || typeof window === "undefined") return 0;
  const style = window.getComputedStyle(el);
  const longest = (value: string): number =>
    value.split(",").reduce((max, part) => {
      const trimmed = part.trim();
      const ms = trimmed.endsWith("ms")
        ? Number.parseFloat(trimmed)
        : Number.parseFloat(trimmed) * 1000;
      return Number.isFinite(ms) ? Math.max(max, ms) : max;
    }, 0);
  return longest(style.transitionDuration) + longest(style.transitionDelay);
}
