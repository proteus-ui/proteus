import type { TextareaHTMLAttributes } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type TextareaSlot = "root" | "field";

export interface TextareaProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "defaultValue" | "onChange"
  > {
  /** Controlled value. Pair with `onValueChange`. */
  value?: string;
  /** Initial value for uncontrolled use. */
  defaultValue?: string;
  /** Called with the next string when the field changes. */
  onValueChange?: (next: string) => void;
  /** Marks the field invalid and exposes `data-invalid`. */
  invalid?: boolean;
  /** Per-slot class names (`root`, `field`). */
  classNames?: SlotClassNames<TextareaSlot>;
}
