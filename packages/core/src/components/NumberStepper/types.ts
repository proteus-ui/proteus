import type { SlotClassNames } from "@proteus-ui/tokens";

export type NumberStepperSlot = "root" | "input" | "inc" | "dec";

export interface NumberStepperProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  invalid?: boolean;
  label?: string;
  classNames?: SlotClassNames<NumberStepperSlot>;
}
