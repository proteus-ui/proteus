import type { HTMLAttributes } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type SpinnerSize = "sm" | "md";
export type SpinnerSlot = "root";
export type PageLoaderSlot = "root";

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  label?: string;
  classNames?: SlotClassNames<SpinnerSlot>;
}

export interface PageLoaderProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  classNames?: SlotClassNames<PageLoaderSlot>;
}
