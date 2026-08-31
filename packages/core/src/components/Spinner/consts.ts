import type { SpinnerSize } from "./types";

export const SPINNER_SIZE = {
  Sm: "sm",
  Md: "md",
} as const satisfies Record<string, SpinnerSize>;

export const SPINNER_CLASS = {
  root: "pr-spinner",
} as const;

export const PAGE_LOADER_CLASS = {
  root: "pr-page-loader",
  label: "pr-page-loader__label",
} as const;

export const SPINNER_LABEL = {
  Loading: "Loading",
} as const;

export const SPINNER_DEFAULT = {
  size: SPINNER_SIZE.Md,
  label: SPINNER_LABEL.Loading,
} as const;
