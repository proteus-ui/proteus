import type { CSSProperties } from "react";

export const SELECT_CLASS = {
  root: "pr-select",
  label: "pr-select__label",
  control: "pr-select__control",
  field: "pr-select__field",
  clear: "pr-select__clear",
  toggle: "pr-select__toggle",
  announcer: "pr-select__announcer",
  list: "pr-select__list",
  option: "pr-select__option",
} as const;

export const SELECT_DEFAULT = {
  value: "",
} as const;

export const SELECT_SYMBOL = {
  Toggle: "▾",
  Clear: "×",
} as const;

export const SELECT_STATE = {
  Open: "open",
  Closed: "closed",
} as const;

export const SELECT_LABEL = {
  Clear: "Clear search",
  CloseOptions: "Close suggestions",
  OpenOptions: "Open suggestions",
  Options: "Suggestions",
  NoResults: "No results found",
} as const;

export const SELECT_OPTION_ID_SUFFIX = "option";

export const SELECT_OPTION_KEY_SEP = "\0";

export const SELECT_DISPLAY_NAME = "Select";

export const DATA_TRUE = "true";

export const ANNOUNCER_STYLE: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};
