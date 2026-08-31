import type { TextareaHTMLAttributes } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type TextareaSlot = "root" | "field";

export interface TextareaProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "defaultValue" | "onChange"
  > {
  value?: string;
  defaultValue?: string;
  onValueChange?: (next: string) => void;
  invalid?: boolean;
  classNames?: SlotClassNames<TextareaSlot>;
}
