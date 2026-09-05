import type { AnchorHTMLAttributes, HTMLAttributes } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import type { CompoundChildren, SlotElement } from "../../utils/compound";
import type { LinkCardBody, LinkCardTitle } from "./LinkCard";

export type LinkCardSlot = "root" | "title" | "body";

export type LinkCardTitleProps = HTMLAttributes<HTMLDivElement>;
export type LinkCardBodyProps = HTMLAttributes<HTMLDivElement>;

export type LinkCardSlotChild =
  | SlotElement<typeof LinkCardTitle>
  | SlotElement<typeof LinkCardBody>;

export interface LinkCardProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "title" | "children"> {
  href: string;
  classNames?: SlotClassNames<LinkCardSlot>;
  children?: CompoundChildren<LinkCardSlotChild>;
}
