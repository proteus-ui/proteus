import type { HTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type FieldSlot = "root" | "label" | "control" | "hint" | "error";

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Visible label associated with the control via `htmlFor` / control `id`. */
  label?: ReactNode;
  /** Form control (e.g. `TextInput`, `Textarea`, `Select`). Receives `id` when a single element. */
  children?: ReactNode;
  /** Optional helper text below the control. */
  hint?: ReactNode;
  /** Optional error text; sets `data-invalid` and `role="alert"`. */
  error?: ReactNode;
  /** Marks the field invalid even without `error` copy. */
  invalid?: boolean;
  /** Override the generated control id used by the label’s `htmlFor`. */
  htmlFor?: string;
  /** Per-slot class names (`root`, `label`, `control`, `hint`, `error`). */
  classNames?: SlotClassNames<FieldSlot>;
}
