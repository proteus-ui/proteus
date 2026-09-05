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
  /** Options shown in the list. Each has a `value` and `label`. */
  options: readonly SelectOption[];
  /** Controlled selected value. Pair with `onValueChange`. */
  value?: string;
  /** Initial selected value for uncontrolled use. */
  defaultValue?: string;
  /** Called with the next selected value. */
  onValueChange?: (value: string) => void;
  /** Disables the field and list. */
  disabled?: boolean;
  /** Marks the field invalid and exposes `data-invalid`. */
  invalid?: boolean;
  /** Visible label for the combobox. */
  label?: string;
  /** Shown when no value is selected. */
  placeholder?: string;
  /** Per-slot class names (`root`, `input`, `label`, `list`, `option`, `clear`, `toggle`, `announcer`). */
  classNames?: SlotClassNames<SelectSlot>;
}
