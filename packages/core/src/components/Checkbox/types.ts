import type { InputHTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type CheckboxSlot = "root" | "input" | "label";

export interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "checked" | "defaultChecked" | "onChange" | "type"
  > {
  /** Controlled checked state. Pair with `onCheckedChange`. */
  checked?: boolean;
  /** Initial checked state for uncontrolled use. */
  defaultChecked?: boolean;
  /** Called with the next checked value. */
  onCheckedChange?: (checked: boolean) => void;
  /** Visual mixed state; does not change the submitted checked value. */
  indeterminate?: boolean;
  /** Marks the control invalid and exposes `data-invalid`. */
  invalid?: boolean;
  /** Visible label associated with the input. */
  label?: ReactNode;
  /** Per-slot class names (`root`, `input`, `label`). */
  classNames?: SlotClassNames<CheckboxSlot>;
}
