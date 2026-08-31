import type { TooltipPlacement } from "./types";

export const TOOLTIP_PLACEMENT = {
  Top: "top",
  Bottom: "bottom",
  Left: "left",
  Right: "right",
} as const satisfies Record<string, TooltipPlacement>;

export const TOOLTIP_CLASS = {
  root: "pr-tooltip",
} as const;

export const TOOLTIP_DEFAULT = {
  placement: TOOLTIP_PLACEMENT.Top,
  delay: 1500,
  offset: 8,
} as const;
