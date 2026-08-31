import type { CSSProperties } from "react";

export const COMBOBOX_CLASS = {
  root: "pr-combobox",
  label: "pr-combobox__label",
  control: "pr-combobox__control",
  field: "pr-combobox__field",
  clear: "pr-combobox__clear",
  toggle: "pr-combobox__toggle",
  announcer: "pr-combobox__announcer",
  list: "pr-combobox__list",
  option: "pr-combobox__option",
  error: "pr-combobox__error",
  hint: "pr-combobox__hint",
} as const;

export const COMBOBOX_DEFAULT = {
  value: "",
  isLoading: false,
  disabled: false,
  onlyDigits: false,
  noResultsText: "No results found",
  minCharsToSearch: 2,
} as const;

export const COMBOBOX_STATE = {
  Open: "open",
  Closed: "closed",
} as const;

export const COMBOBOX_LABEL = {
  Clear: "Clear search",
  CloseSuggestions: "Close suggestions",
  OpenSuggestions: "Open suggestions",
  Loading: "Loading suggestions",
  Suggestions: "Suggestions",
} as const;

export const COMBOBOX_SYMBOL = {
  Clear: "×",
} as const;

export const COMBOBOX_PATTERN = {
  Digits: "[0-9]*",
  NonDigits: /\D+/g,
} as const;

export const COMBOBOX_SUGGESTION_KEY_SEP = "\0";

export const COMBOBOX_OPTION_ID_SUFFIX = "option";

export const COMBOBOX_DISPLAY_NAME = "Combobox";

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
