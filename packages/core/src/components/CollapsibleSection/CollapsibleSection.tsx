import { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";
import { useControllableState } from "../../hooks/useControllableState";
import {
  COLLAPSIBLE_CLASS,
  COLLAPSIBLE_DEFAULT,
  COLLAPSIBLE_ID,
  COLLAPSIBLE_ITEM_KEY_SEP,
  COLLAPSIBLE_STATE,
  COLLAPSIBLE_SYMBOL,
} from "./consts";
import type { CollapsibleSectionProps } from "./types";
import { defaultOpenIds, nextIds, resolveOpenIds, sameIds } from "./utils";

export function CollapsibleSection({
  items,
  mode = COLLAPSIBLE_DEFAULT.mode,
  openIds,
  onOpenChange,
  classNames,
}: CollapsibleSectionProps) {
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
    <div className={cn(COLLAPSIBLE_CLASS.root, classNames?.root)}>
      {items.map((item) => {
        const open = openList.includes(item.id);
        const triggerId = `${COLLAPSIBLE_ID.TriggerPrefix}${item.id}`;
        const panelId = `${COLLAPSIBLE_ID.PanelPrefix}${item.id}`;
        return (
          <div key={item.id} className={cn(COLLAPSIBLE_CLASS.item, classNames?.item)}>
            <button
              type="button"
              id={triggerId}
              className={cn(COLLAPSIBLE_CLASS.trigger, classNames?.trigger)}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => set(nextIds(mode, openList, item.id))}
            >
              {item.title}
              <span aria-hidden="true">{COLLAPSIBLE_SYMBOL.Chevron}</span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              data-state={open ? COLLAPSIBLE_STATE.Open : COLLAPSIBLE_STATE.Closed}
              hidden={!open}
              className={cn(COLLAPSIBLE_CLASS.panel, classNames?.panel)}
            >
              {item.children}
            </div>
          </div>
        );
      })}
    </div>
  );
}
