import type { ComboboxProps, Suggestion } from "../Combobox";

export interface EntitySelectorProps extends Omit<ComboboxProps, "label"> {
  label: string;
  onEntitySelect?: (s: Suggestion) => void;
}
