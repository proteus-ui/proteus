import type { ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type CollapsibleItem = {
  id: string;
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
};

export type CollapsibleMode = "single" | "multiple";

export type CollapsibleSectionSlot = "root" | "item" | "trigger" | "panel";

export interface CollapsibleSectionProps {
  items: readonly CollapsibleItem[];
  mode?: CollapsibleMode;
  openIds?: string[];
  onOpenChange?: (ids: string[]) => void;
  classNames?: SlotClassNames<CollapsibleSectionSlot>;
}
