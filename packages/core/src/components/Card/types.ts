import type { HTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type CardSlot = "root" | "header" | "body" | "footer";

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  footer?: ReactNode;
  classNames?: SlotClassNames<CardSlot>;
  children?: ReactNode;
}
