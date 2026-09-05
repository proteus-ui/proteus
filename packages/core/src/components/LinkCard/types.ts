import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type LinkCardSlot = "root" | "title" | "body";

export type LinkCardTitleProps = HTMLAttributes<HTMLDivElement>;
export type LinkCardBodyProps = HTMLAttributes<HTMLDivElement>;

export interface LinkCardProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "title" | "children"> {
  /** Destination URL. The root renders as an anchor. */
  href: string;
  /** Per-slot class names (`root`, `title`, `body`). */
  classNames?: SlotClassNames<LinkCardSlot>;
  /** Slot children: `LinkCard.Title`, `LinkCard.Body`. */
  children?: ReactNode;
}
