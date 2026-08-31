import { describe, expect, it } from "vitest";
import { getTransitionDurationMs } from "./transition";

describe("getTransitionDurationMs", () => {
  it("returns 0 for a null element", () => {
    expect(getTransitionDurationMs(null)).toBe(0);
  });

  it("sums the longest transition-duration with the transition-delay", () => {
    const el = document.createElement("div");
    el.style.transitionDuration = "200ms, 0.3s";
    el.style.transitionDelay = "100ms";
    document.body.appendChild(el);
    expect(getTransitionDurationMs(el)).toBe(400); // max(200, 300) + 100
    el.remove();
  });
});
