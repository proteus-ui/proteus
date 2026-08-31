import type { HTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type PageFrameSlot = "root" | "header" | "main" | "footer";

export interface PageFrameProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
  classNames?: SlotClassNames<PageFrameSlot>;
  children?: ReactNode;
}
