import type { ReactElement, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";
export type TooltipSlot = "root";

export interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  placement?: TooltipPlacement;
  delay?: number;
  classNames?: SlotClassNames<"root">;
}

export type TooltipTriggerState = {
  isOpen: boolean;
  shouldSkipAnimation: boolean;
  open: (immediate?: boolean) => void;
  close: (immediate?: boolean) => void;
};
