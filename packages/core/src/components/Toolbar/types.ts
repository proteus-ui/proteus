import type { HTMLAttributes } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import type { ButtonProps } from "../Button";

export type ToolbarSlot = "root";

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  /** Per-slot class names (`root`). */
  classNames?: SlotClassNames<ToolbarSlot>;
}

export interface ToolbarButtonProps extends ButtonProps {
  /** Whether the action is in a pressed / selected state. */
  pressed?: boolean;
}
