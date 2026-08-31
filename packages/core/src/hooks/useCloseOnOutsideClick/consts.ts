import type { AutoClose } from "./types";

export const AUTO_CLOSE = {
  Outside: "outside",
  Inside: "inside",
  Always: true,
  Never: false,
} as const satisfies Record<string, AutoClose>;

export const AUTO_CLOSE_DEFAULT = AUTO_CLOSE.Outside;

export const CLICK_EVENT = "click";
