import type { SlotClassNames } from "@proteus-ui/tokens";
import type { NavigationKey } from "../../utils/keyboard";

export type { NavigationKey };

export type SelectOption = { value: string; label: string };

export type SelectSlot =
  | "root"
  | "input"
  | "label"
  | "list"
  | "option"
  | "clear"
  | "toggle"
  | "announcer";

export interface SelectProps {
  options: readonly SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  label?: string;
  placeholder?: string;
  classNames?: SlotClassNames<SelectSlot>;
}
