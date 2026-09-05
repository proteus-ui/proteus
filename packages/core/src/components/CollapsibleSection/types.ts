import type { HTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type CollapsibleMode = "single" | "multiple";

export type CollapsibleSectionSlot = "root" | "item" | "trigger" | "panel";

export type CollapsibleTitleProps = HTMLAttributes<HTMLSpanElement>;
export type CollapsiblePanelProps = HTMLAttributes<HTMLDivElement>;

export interface CollapsibleItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Stable id used for controlled `openIds`. */
  id: string;
  /** Whether the item starts open when uncontrolled. */
  defaultOpen?: boolean;
  /** Slot children: `CollapsibleSection.Item` title and panel. */
  children?: ReactNode;
}

export interface CollapsibleSectionProps {
  /** `single` keeps one item open; `multiple` allows many. */
  mode?: CollapsibleMode;
  /** Controlled set of open item ids. Pair with `onOpenChange`. */
  openIds?: string[];
  /** Called with the next open ids. */
  onOpenChange?: (ids: string[]) => void;
  /** Per-slot class names (`root`, `item`, `trigger`, `panel`). */
  classNames?: SlotClassNames<CollapsibleSectionSlot>;
  /** Repeating `CollapsibleSection.Item` children. */
  children?: ReactNode;
}

export type CollapsibleItemMeta = {
  id: string;
  defaultOpen?: boolean;
};
