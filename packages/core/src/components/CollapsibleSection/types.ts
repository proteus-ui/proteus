import type { HTMLAttributes } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import type { CompoundChildren, SlotElement } from "../../utils/compound";
import type {
  CollapsibleItem,
  CollapsiblePanel,
  CollapsibleTitle,
} from "./CollapsibleSection";

export type CollapsibleMode = "single" | "multiple";

export type CollapsibleSectionSlot = "root" | "item" | "trigger" | "panel";

export type CollapsibleTitleProps = HTMLAttributes<HTMLSpanElement>;
export type CollapsiblePanelProps = HTMLAttributes<HTMLDivElement>;

export type CollapsibleItemSlotChild =
  | SlotElement<typeof CollapsibleTitle>
  | SlotElement<typeof CollapsiblePanel>;

export interface CollapsibleItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  id: string;
  defaultOpen?: boolean;
  children?: CompoundChildren<CollapsibleItemSlotChild>;
}

export type CollapsibleSectionSlotChild = SlotElement<typeof CollapsibleItem>;

export interface CollapsibleSectionProps {
  mode?: CollapsibleMode;
  openIds?: string[];
  onOpenChange?: (ids: string[]) => void;
  classNames?: SlotClassNames<CollapsibleSectionSlot>;
  children?: CompoundChildren<CollapsibleSectionSlotChild>;
}

export type CollapsibleItemMeta = {
  id: string;
  defaultOpen?: boolean;
};
