import type { HTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type SectionSlot = "root" | "title" | "body";

export type SectionTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type SectionBodyProps = HTMLAttributes<HTMLDivElement>;

export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
  /** Per-slot class names (`root`, `title`, `body`). */
  classNames?: SlotClassNames<SectionSlot>;
  /** Slot children: `Section.Title`, `Section.Body`. */
  children?: ReactNode;
}
