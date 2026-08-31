import type { RefObject } from "react";

export type AutoClose = "outside" | "inside" | true | false;

export interface UseCloseOnOutsideClickOptions {
  togglerRef?: RefObject<HTMLElement | null>;
  mode?: AutoClose;
}
