import type { InputHTMLAttributes } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type SearchBarSlot = "root" | "input" | "clear";

export interface SearchBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (next: string) => void;
  onClear?: () => void;
  classNames?: SlotClassNames<SearchBarSlot>;
}
