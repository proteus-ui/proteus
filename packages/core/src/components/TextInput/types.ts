import type { InputHTMLAttributes } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type TextInputSlot = "root" | "input";

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
  /** Controlled value. Pair with `onValueChange`. */
  value?: string;
  /** Initial value for uncontrolled use. */
  defaultValue?: string;
  /** Called with the next string when the field changes. */
  onValueChange?: (next: string) => void;
  /** Marks the field invalid and exposes `data-invalid`. */
  invalid?: boolean;
  /** Per-slot class names (`root`, `input`). */
  classNames?: SlotClassNames<TextInputSlot>;
}
