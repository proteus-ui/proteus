import type { HTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type BadgeIntent = "neutral" | "primary" | "danger";
export type BadgeSlot = "root";
export type BadgeVariant = "badge" | "pill";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  intent?: BadgeIntent;
  classNames?: SlotClassNames<BadgeSlot>;
  children?: ReactNode;
}
