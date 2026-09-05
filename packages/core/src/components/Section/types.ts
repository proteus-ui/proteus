import type { HTMLAttributes } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import type { CompoundChildren, SlotElement } from "../../utils/compound";
import type { SectionBody, SectionTitle } from "./Section";

export type SectionSlot = "root" | "title" | "body";

export type SectionTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type SectionBodyProps = HTMLAttributes<HTMLDivElement>;

export type SectionSlotChild = SlotElement<typeof SectionTitle> | SlotElement<typeof SectionBody>;

export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
  classNames?: SlotClassNames<SectionSlot>;
  children?: CompoundChildren<SectionSlotChild>;
}
