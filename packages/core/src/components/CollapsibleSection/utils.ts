import { COLLAPSIBLE_MODE } from "./consts";
import type { CollapsibleItem, CollapsibleMode } from "./types";

export function nextIds(mode: CollapsibleMode, current: string[], id: string): string[] {
  const isOpen = current.includes(id);
  if (mode === COLLAPSIBLE_MODE.Single) return isOpen ? [] : [id];
  return isOpen ? current.filter((x) => x !== id) : [...current, id];
}

export function defaultOpenIds(items: readonly CollapsibleItem[]): string[] {
  return items.filter((i) => i.defaultOpen).map((i) => i.id);
}

export function resolveOpenIds(mode: CollapsibleMode, ids: string[]): string[] {
  if (mode === COLLAPSIBLE_MODE.Single && ids.length > 1) return ids.slice(0, 1);
  return ids;
}

export function sameIds(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((id, i) => id === b[i]);
}
