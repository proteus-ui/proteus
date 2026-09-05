import type { SlotClassNames } from "@proteus-ui/tokens";

export type NumberStepperSlot = "root" | "input" | "inc" | "dec";

export interface NumberStepperProps {
  /** Controlled numeric value. Pair with `onValueChange`. */
  value?: number;
  /** Initial value for uncontrolled use. */
  defaultValue?: number;
  /** Called with the next number. */
  onValueChange?: (n: number) => void;
  /** Inclusive lower bound. */
  min?: number;
  /** Inclusive upper bound. */
  max?: number;
  /** Increment applied by the stepper buttons. */
  step?: number;
  /** Disables the field and buttons. */
  disabled?: boolean;
  /** Marks the field invalid and exposes `data-invalid`. */
  invalid?: boolean;
  /** Accessible name for the field. */
  label?: string;
  /** Per-slot class names (`root`, `input`, `inc`, `dec`). */
  classNames?: SlotClassNames<NumberStepperSlot>;
}
