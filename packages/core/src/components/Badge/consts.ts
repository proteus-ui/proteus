import type { BadgeIntent, BadgeVariant } from "./types";

export const BADGE_INTENT = {
  Neutral: "neutral",
  Primary: "primary",
  Danger: "danger",
} as const satisfies Record<string, BadgeIntent>;

export const BADGE_VARIANT = {
  Badge: "badge",
  Pill: "pill",
} as const satisfies Record<string, BadgeVariant>;

export const BADGE_CLASS = {
  root: "pr-badge",
} as const;

export const BADGE_DEFAULT = {
  intent: BADGE_INTENT.Neutral,
} as const;

export const BADGE_DISPLAY_NAME = {
  Badge: "Badge",
  Pill: "Pill",
} as const;
