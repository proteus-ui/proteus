import type { HTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type PageFrameSlot = "root" | "header" | "main" | "footer";

export type PageFrameHeaderProps = HTMLAttributes<HTMLElement>;
export type PageFrameMainProps = HTMLAttributes<HTMLElement>;
export type PageFrameFooterProps = HTMLAttributes<HTMLElement>;

export interface PageFrameProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Per-slot class names (`root`, `header`, `main`, `footer`). */
  classNames?: SlotClassNames<PageFrameSlot>;
  /** Slot children: `PageFrame.Header`, `PageFrame.Main`, `PageFrame.Footer`. */
  children?: ReactNode;
}
