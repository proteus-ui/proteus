import type { AnchorHTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type LinkCardSlot = "root" | "title" | "body";

export interface LinkCardProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "title"> {
  href: string;
  title?: ReactNode;
  classNames?: SlotClassNames<LinkCardSlot>;
  children?: ReactNode;
}
