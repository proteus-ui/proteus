import type { InputHTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type CheckboxSlot = "root" | "input" | "label";

export interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "checked" | "defaultChecked" | "onChange" | "type"
  > {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  invalid?: boolean;
  label?: ReactNode;
  classNames?: SlotClassNames<CheckboxSlot>;
}
