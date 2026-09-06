import type { HTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

/** Maps to semantic color tokens (same model as Button: intent → `--pr-color-*`). */
export type BadgeIntent = "neutral" | "primary" | "danger" | "success" | "warning";
export type BadgeSlot = "root";
export type BadgeVariant = "badge" | "pill";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Semantic color from the token palette:
   * `neutral`, `primary` (`action-primary`), `danger` (`feedback-error`),
   * `success` (`feedback-success`), `warning` (`feedback-warning`).
   */
  intent?: BadgeIntent;
  /** Per-slot class names (`root`). */
  classNames?: SlotClassNames<BadgeSlot>;
  /** Text or content shown inside the badge. */
  children?: ReactNode;
}
