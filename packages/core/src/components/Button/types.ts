import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type ButtonIntent = "neutral" | "primary" | "danger";
export type ButtonSize = "sm" | "md";
export type ButtonVariant = "solid" | "outline";
export type ButtonSlot = "root" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: ButtonIntent;
  size?: ButtonSize;
  variant?: ButtonVariant;
  icon?: ReactNode;
  classNames?: SlotClassNames<ButtonSlot>;
}
