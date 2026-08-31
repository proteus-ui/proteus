import type { SlotClassNames } from "@proteus-ui/tokens";

export type TimeInputSlot = "root" | "input" | "error";

export interface TimeInputProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  errorMessage?: string;
  label?: string;
  classNames?: SlotClassNames<TimeInputSlot>;
}
