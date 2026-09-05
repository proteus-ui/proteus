import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";
export type TooltipSlot = "root";

export type TooltipTriggerProps = {
  /** Single element that receives hover and focus listeners. */
  children: ReactElement;
};

export type TooltipContentProps = HTMLAttributes<HTMLDivElement>;

export interface TooltipProps {
  /** Side of the trigger where the tip appears (`top`, `bottom`, `left`, `right`). */
  placement?: TooltipPlacement;
  /** Delay in milliseconds before the tip opens. */
  delay?: number;
  /** Per-slot class names (`root`). */
  classNames?: SlotClassNames<"root">;
  /** Slot children: `Tooltip.Trigger` and `Tooltip.Content`. */
  children?: ReactNode;
}

export type TooltipTriggerState = {
  isOpen: boolean;
  shouldSkipAnimation: boolean;
  open: (immediate?: boolean) => void;
  close: (immediate?: boolean) => void;
};
