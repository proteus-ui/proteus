import type { HTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type BadgeIntent = "neutral" | "primary" | "danger";
export type BadgeSlot = "root";
export type BadgeVariant = "badge" | "pill";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Semantic color of the label (`neutral`, `primary`, or `danger`). */
  intent?: BadgeIntent;
  /** Per-slot class names (`root`). */
  classNames?: SlotClassNames<BadgeSlot>;
  /** Text or content shown inside the badge. */
  children?: ReactNode;
}
