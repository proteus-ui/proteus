import type { CollapsibleMode } from "./types";

export const COLLAPSIBLE_MODE = {
  Single: "single",
  Multiple: "multiple",
} as const satisfies Record<string, CollapsibleMode>;

export const COLLAPSIBLE_CLASS = {
  root: "pr-collapse",
  item: "pr-collapse__item",
  trigger: "pr-collapse__trigger",
  panel: "pr-collapse__panel",
} as const;

export const COLLAPSIBLE_DEFAULT = {
  mode: COLLAPSIBLE_MODE.Single,
} as const;

export const COLLAPSIBLE_STATE = {
  Open: "open",
  Closed: "closed",
} as const;

export const COLLAPSIBLE_ID = {
  TriggerPrefix: "accordion-trigger-",
  PanelPrefix: "accordion-panel-",
} as const;

export const COLLAPSIBLE_ITEM_KEY_SEP = "\0";

export const COLLAPSIBLE_SYMBOL = {
  Chevron: "▾",
} as const;
