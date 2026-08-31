import type { HTMLAttributes } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import type { ButtonProps } from "../Button";

export type ToolbarSlot = "root";

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  classNames?: SlotClassNames<ToolbarSlot>;
}

export interface ToolbarButtonProps extends ButtonProps {
  pressed?: boolean;
}
