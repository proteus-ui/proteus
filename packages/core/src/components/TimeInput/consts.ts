export const TIME_INPUT_CLASS = {
  root: "pr-time",
  field: "pr-time__field",
  error: "pr-time__error",
} as const;

export const TIME_INPUT_DEFAULT = {
  value: "",
} as const;

export const TIME_INPUT_PLACEHOLDER = "HH:MM";

export const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export const DATA_TRUE = "true";
