import { useEffect, useRef, useState, type FocusEvent } from "react";
import { useControllableState } from "../../hooks/useControllableState";
import type { ComboboxProps, Suggestion } from "../Combobox";
import { Combobox } from "../Combobox";

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

function labelForId(id: string, options: readonly SelectOption[]): string {
  return options.find((option) => option.value === id)?.label ?? "";
}

export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  invalid,
  label,
  placeholder,
  classNames,
}: SelectProps) {
  const [selectedId, setSelectedId] = useControllableState({
    value,
    defaultValue: defaultValue ?? "",
    onChange: onValueChange,
  });
  const isTypingRef = useRef(false);
  const [query, setQuery] = useState(() => labelForId(value ?? defaultValue ?? "", options));

  const restoreQuery = () => {
    isTypingRef.current = false;
    setQuery(labelForId(selectedId, options));
  };

  const handleClear = () => {
    isTypingRef.current = false;
    setQuery("");
    setSelectedId("");
  };

  useEffect(() => {
    if (isTypingRef.current) return;
    setQuery(labelForId(selectedId, options));
  }, [selectedId, options]);

  const handleQueryChange = (next: string) => {
    isTypingRef.current = true;
    setQuery(next);
  };

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    isTypingRef.current = false;
    setQuery(suggestion.label);
    setSelectedId(suggestion.value);
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    restoreQuery();
  };

  return (
    <div onBlur={handleBlur}>
      <Combobox
        value={query}
        onValueChange={handleQueryChange}
        suggestions={options}
        minCharsToSearch={0}
        toggleIcon="▾"
        disabled={disabled}
        invalid={invalid}
        label={label}
        placeholder={placeholder}
        classNames={classNames}
        onSuggestionSelect={handleSuggestionSelect}
        onClear={handleClear}
      />
    </div>
  );
}
