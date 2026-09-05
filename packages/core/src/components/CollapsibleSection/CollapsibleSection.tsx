import { createContext, useContext, useEffect, useRef } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../../utils/cn";
import { asSlot, collectNamedSlots, collectRepeatingSlot } from "../../utils/compound";
import { useControllableState } from "../../hooks/useControllableState";
import {
  COLLAPSIBLE_CLASS,
  COLLAPSIBLE_DEFAULT,
  COLLAPSIBLE_DISPLAY_NAME,
  COLLAPSIBLE_ID,
  COLLAPSIBLE_ITEM_KEY_SEP,
  COLLAPSIBLE_STATE,
  COLLAPSIBLE_SYMBOL,
} from "./consts";
import type {
  CollapsibleItemMeta,
  CollapsibleItemProps,
  CollapsibleMode,
  CollapsiblePanelProps,
  CollapsibleSectionProps,
  CollapsibleSectionSlot,
  CollapsibleTitleProps,
} from "./types";
import { defaultOpenIds, nextIds, resolveOpenIds, sameIds } from "./utils";

type CollapsibleContextValue = {
  openList: string[];
  set: (ids: string[]) => void;
  mode: CollapsibleMode;
  classNames?: SlotClassNames<CollapsibleSectionSlot>;
};

const CollapsibleContext = createContext<CollapsibleContextValue | undefined>(undefined);

export const CollapsibleTitle = asSlot(
  COLLAPSIBLE_DISPLAY_NAME.Title,
  function CollapsibleTitle({ className, children, ...rest }: CollapsibleTitleProps) {
    return (
      <span className={className} {...rest}>
        {children}
      </span>
    );
  },
);

export const CollapsiblePanel = asSlot(
  COLLAPSIBLE_DISPLAY_NAME.Panel,
  function CollapsiblePanel({ children }: CollapsiblePanelProps) {
    return children;
  },
);

export const CollapsibleItem = asSlot(
  COLLAPSIBLE_DISPLAY_NAME.Item,
  function CollapsibleItem({
    id,
    className,
    children,
    defaultOpen: _defaultOpen,
    ...rest
  }: CollapsibleItemProps) {
  const ctx = useContext(CollapsibleContext);
  const slots = collectNamedSlots(
    children,
    { Title: CollapsibleTitle, Panel: CollapsiblePanel },
    COLLAPSIBLE_DISPLAY_NAME.Item,
  );
  const open = ctx?.openList.includes(id) ?? false;
  const triggerId = `${COLLAPSIBLE_ID.TriggerPrefix}${id}`;
  const panelId = `${COLLAPSIBLE_ID.PanelPrefix}${id}`;
  return (
    <div
      className={cn(COLLAPSIBLE_CLASS.item, ctx?.classNames?.item, className)}
      {...rest}
    >
      <button
        type="button"
        id={triggerId}
        className={cn(COLLAPSIBLE_CLASS.trigger, ctx?.classNames?.trigger)}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => ctx?.set(nextIds(ctx.mode, ctx.openList, id))}
      >
        {slots.Title}
        <span aria-hidden="true">{COLLAPSIBLE_SYMBOL.Chevron}</span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        data-state={open ? COLLAPSIBLE_STATE.Open : COLLAPSIBLE_STATE.Closed}
        hidden={!open}
        className={cn(COLLAPSIBLE_CLASS.panel, ctx?.classNames?.panel)}
      >
        {slots.Panel}
      </div>
    </div>
  );
},
);

export function CollapsibleSection({
  mode = COLLAPSIBLE_DEFAULT.mode,
  openIds,
  onOpenChange,
  classNames,
  children,
}: CollapsibleSectionProps) {
  const itemEls = collectRepeatingSlot(
    children,
    CollapsibleItem,
    COLLAPSIBLE_DISPLAY_NAME.Root,
    "Item",
  );
  const items: CollapsibleItemMeta[] = itemEls.map((el) => ({
    id: el.props.id,
    defaultOpen: el.props.defaultOpen,
  }));

  const [current, set] = useControllableState({
    value: openIds,
    defaultValue: resolveOpenIds(mode, defaultOpenIds(items)),
    onChange: onOpenChange,
  });
  const openList = resolveOpenIds(mode, current);

  const itemKey = items.map((i) => i.id).join(COLLAPSIBLE_ITEM_KEY_SEP);
  const prevKeyRef = useRef(itemKey);

  useEffect(() => {
    if (openIds !== undefined) {
      prevKeyRef.current = itemKey;
      return;
    }
    let next = current;
    if (prevKeyRef.current !== itemKey) {
      const prevIds = prevKeyRef.current.split(COLLAPSIBLE_ITEM_KEY_SEP).filter(Boolean);
      prevKeyRef.current = itemKey;
      const existing = new Set(items.map((i) => i.id));
      const prevSet = new Set(prevIds);
      const preserved = current.filter((id) => existing.has(id));
      const added = items.filter((i) => !prevSet.has(i.id) && i.defaultOpen).map((i) => i.id);
      next = [...preserved, ...added.filter((id) => !preserved.includes(id))];
    }
    next = resolveOpenIds(mode, next);
    if (!sameIds(next, current)) set(next);
  }, [itemKey, items, openIds, current, set, mode]);

  return (
    <CollapsibleContext.Provider value={{ openList, set, mode, classNames }}>
      <div className={cn(COLLAPSIBLE_CLASS.root, classNames?.root)}>{itemEls}</div>
    </CollapsibleContext.Provider>
  );
}

CollapsibleSection.Item = CollapsibleItem;
CollapsibleSection.Title = CollapsibleTitle;
CollapsibleSection.Panel = CollapsiblePanel;
CollapsibleSection.displayName = COLLAPSIBLE_DISPLAY_NAME.Root;
