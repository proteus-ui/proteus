import type { InputHTMLAttributes } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type SearchBarSlot = "root" | "input" | "clear";

export interface SearchBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
  /** Controlled query. Pair with `onValueChange`. */
  value?: string;
  /** Initial query for uncontrolled use. */
  defaultValue?: string;
  /** Called with the next query string. */
  onValueChange?: (next: string) => void;
  /** Called when the clear control is activated. */
  onClear?: () => void;
  /** Per-slot class names (`root`, `input`, `clear`). */
  classNames?: SlotClassNames<SearchBarSlot>;
}
