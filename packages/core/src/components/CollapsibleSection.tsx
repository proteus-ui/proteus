import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../utils/cn";
import { useControllableState } from "../hooks/useControllableState";

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

function nextIds(mode: CollapsibleMode, current: string[], id: string): string[] {
  const isOpen = current.includes(id);
  if (mode === "single") return isOpen ? [] : [id];
  return isOpen ? current.filter((x) => x !== id) : [...current, id];
}

function defaultOpenIds(items: readonly CollapsibleItem[]): string[] {
  return items.filter((i) => i.defaultOpen).map((i) => i.id);
}

function resolveOpenIds(mode: CollapsibleMode, ids: string[]): string[] {
  if (mode === "single" && ids.length > 1) return ids.slice(0, 1);
  return ids;
}

function sameIds(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((id, i) => id === b[i]);
}

export function CollapsibleSection({
  items,
  mode = "single",
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

  const itemKey = items.map((i) => i.id).join("\0");
  const prevKeyRef = useRef(itemKey);

  useEffect(() => {
    if (openIds !== undefined) {
      prevKeyRef.current = itemKey;
      return;
    }
    let next = current;
    if (prevKeyRef.current !== itemKey) {
      const prevIds = prevKeyRef.current.split("\0").filter(Boolean);
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
    <div className={cn("pr-collapse", classNames?.root)}>
      {items.map((item) => {
        const open = openList.includes(item.id);
        const triggerId = `accordion-trigger-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;
        return (
          <div key={item.id} className={cn("pr-collapse__item", classNames?.item)}>
            <button
              type="button"
              id={triggerId}
              className={cn("pr-collapse__trigger", classNames?.trigger)}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => set(nextIds(mode, openList, item.id))}
            >
              {item.title}
              <span aria-hidden="true">▾</span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              data-state={open ? "open" : "closed"}
              hidden={!open}
              className={cn("pr-collapse__panel", classNames?.panel)}
            >
              {item.children}
            </div>
          </div>
        );
      })}
    </div>
  );
}
