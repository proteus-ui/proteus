import type { ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import type { NavigationKey } from "../../utils/keyboard";

export type { NavigationKey };

export type Suggestion = { value: string; label: string; data?: unknown };

export type ComboboxSlot =
  | "root"
  | "input"
  | "label"
  | "list"
  | "option"
  | "clear"
  | "toggle"
  | "announcer"
  | "error"
  | "hint";

export interface ComboboxProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  suggestions?: readonly Suggestion[];
  isLoading?: boolean;
  disabled?: boolean;
  onlyDigits?: boolean;
  placeholder?: string;
  noResultsText?: string;
  minCharsToSearch?: number;
  invalid?: boolean;
  errorMessage?: string;
  hintMessage?: string;
  label?: string;
  onSuggestionSelect?: (s: Suggestion) => void;
  onClear?: () => void;
  classNames?: SlotClassNames<ComboboxSlot>;
  toggleIcon?: ReactNode;
}
