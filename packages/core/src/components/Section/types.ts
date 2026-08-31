import type { HTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type SectionSlot = "root" | "title" | "body";

export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  classNames?: SlotClassNames<SectionSlot>;
  children?: ReactNode;
}
