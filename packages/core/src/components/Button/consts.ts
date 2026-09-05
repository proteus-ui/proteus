import type { ButtonIntent, ButtonSize, ButtonVariant } from "./types";

export const BUTTON_INTENT = {
  Neutral: "neutral",
  Primary: "primary",
  Danger: "danger",
} as const satisfies Record<string, ButtonIntent>;

export const BUTTON_SIZE = {
  Sm: "sm",
  Md: "md",
} as const satisfies Record<string, ButtonSize>;

export const BUTTON_VARIANT = {
  Solid: "solid",
  Outline: "outline",
} as const satisfies Record<string, ButtonVariant>;

export const BUTTON_CLASS = {
  root: "pr-button",
  icon: "pr-button__icon",
} as const;

export const BUTTON_DEFAULT = {
  intent: BUTTON_INTENT.Neutral,
  size: BUTTON_SIZE.Md,
  variant: BUTTON_VARIANT.Solid,
} as const;

export const BUTTON_DISPLAY_NAME = {
  Button: "Button",
  IconButton: "IconButton",
} as const;

export const DATA_TRUE = "true";
