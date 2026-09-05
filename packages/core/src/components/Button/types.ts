import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type ButtonIntent = "neutral" | "primary" | "danger";
export type ButtonSize = "sm" | "md";
export type ButtonVariant = "solid" | "outline";
export type ButtonSlot = "root" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Semantic color of the action (`neutral`, `primary`, or `danger`). */
  intent?: ButtonIntent;
  /** Visual scale of the button (`sm` or `md`). */
  size?: ButtonSize;
  /** Surface treatment (`solid` or `outline`). */
  variant?: ButtonVariant;
  /** Optional leading icon. Decorative; the accessible name comes from `children` or `aria-label`. */
  icon?: ReactNode;
  /** Per-slot class names (`root`, `icon`). */
  classNames?: SlotClassNames<ButtonSlot>;
}
