import type { ComboboxProps } from "../Combobox";

export type SelectOption = { value: string; label: string };

export interface SelectProps {
  options: readonly SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  label?: string;
  placeholder?: string;
  classNames?: ComboboxProps["classNames"];
}
