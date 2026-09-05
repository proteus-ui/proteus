import type { HTMLAttributes } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type SpinnerSize = "sm" | "md";
export type SpinnerSlot = "root";
export type PageLoaderSlot = "root" | "label";

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual scale (`sm` or `md`). */
  size?: SpinnerSize;
  /** Accessible name announced to assistive tech. */
  label?: string;
  /** Per-slot class names (`root`). */
  classNames?: SlotClassNames<SpinnerSlot>;
}

export interface PageLoaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Visible and accessible loading message. */
  label?: string;
  /** Per-slot class names (`root`, `label`). */
  classNames?: SlotClassNames<PageLoaderSlot>;
}
