import type { SlotClassNames } from "@proteus-ui/tokens";

export type TimeInputSlot = "root" | "input" | "error";

export interface TimeInputProps {
  /** Controlled time string. Pair with `onValueChange`. */
  value?: string;
  /** Initial time for uncontrolled use. */
  defaultValue?: string;
  /** Called with the next time string. */
  onValueChange?: (v: string) => void;
  /** Disables the field. */
  disabled?: boolean;
  /** Marks the field invalid and exposes `data-invalid`. */
  invalid?: boolean;
  /** Error text shown when `invalid` is set. */
  errorMessage?: string;
  /** Visible label for the field. */
  label?: string;
  /** Per-slot class names (`root`, `input`, `error`). */
  classNames?: SlotClassNames<TimeInputSlot>;
}
