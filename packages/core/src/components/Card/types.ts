import type { HTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type CardSlot = "root" | "header" | "body" | "footer";

export type CardTitleProps = HTMLAttributes<HTMLDivElement>;
export type CardBodyProps = HTMLAttributes<HTMLDivElement>;
export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
  /** Per-slot class names (`root`, `header`, `body`, `footer`). */
  classNames?: SlotClassNames<CardSlot>;
  /** Slot children: `Card.Title`, `Card.Body`, `Card.Footer`. */
  children?: ReactNode;
}
