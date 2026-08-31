import type { InputHTMLAttributes } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type TextInputSlot = "root" | "input";

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (next: string) => void;
  invalid?: boolean;
  classNames?: SlotClassNames<TextInputSlot>;
}
