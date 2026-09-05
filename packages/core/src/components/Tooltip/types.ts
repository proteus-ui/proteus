import type { HTMLAttributes, ReactElement } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import type { CompoundChildren, SlotElement } from "../../utils/compound";
import type { TooltipContent, TooltipTrigger } from "./Tooltip";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";
export type TooltipSlot = "root";

export type TooltipTriggerProps = {
  children: ReactElement;
};

export type TooltipContentProps = HTMLAttributes<HTMLDivElement>;

export type TooltipSlotChild =
  | SlotElement<typeof TooltipTrigger>
  | SlotElement<typeof TooltipContent>;

export interface TooltipProps {
  placement?: TooltipPlacement;
  delay?: number;
  classNames?: SlotClassNames<"root">;
  children?: CompoundChildren<TooltipSlotChild>;
}

export type TooltipTriggerState = {
  isOpen: boolean;
  shouldSkipAnimation: boolean;
  open: (immediate?: boolean) => void;
  close: (immediate?: boolean) => void;
};
