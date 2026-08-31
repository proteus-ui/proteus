import { BUTTON_DEFAULT } from "../Button/consts";

export const TOOLBAR_CLASS = {
  root: "pr-toolbar",
  button: "pr-toolbar__button",
  icon: "pr-button__icon",
} as const;

export const TOOLBAR_DEFAULT = {
  intent: BUTTON_DEFAULT.intent,
  size: BUTTON_DEFAULT.size,
} as const;

export const TOOLBAR_DISPLAY_NAME = {
  Toolbar: "Toolbar",
  ToolbarButton: "ToolbarButton",
} as const;

export const DATA_TRUE = "true";
