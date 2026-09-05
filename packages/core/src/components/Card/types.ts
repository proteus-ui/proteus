import type { HTMLAttributes } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import type { CompoundChildren, SlotElement } from "../../utils/compound";
import type { CardBody, CardFooter, CardTitle } from "./Card";

export type CardSlot = "root" | "header" | "body" | "footer";

export type CardTitleProps = HTMLAttributes<HTMLDivElement>;
export type CardBodyProps = HTMLAttributes<HTMLDivElement>;
export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export type CardSlotChild =
  | SlotElement<typeof CardTitle>
  | SlotElement<typeof CardBody>
  | SlotElement<typeof CardFooter>;

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
  classNames?: SlotClassNames<CardSlot>;
  children?: CompoundChildren<CardSlotChild>;
}
