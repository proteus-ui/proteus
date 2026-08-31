import { useEffect, useRef, useState, type FocusEvent } from "react";
import { useControllableState } from "../../hooks/useControllableState";
import type { Suggestion } from "../Combobox";
import { Combobox } from "../Combobox";
import { SELECT_DEFAULT, SELECT_MIN_CHARS, SELECT_SYMBOL } from "./consts";
import type { SelectProps } from "./types";
import { labelForId } from "./utils";

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
    defaultValue: defaultValue ?? SELECT_DEFAULT.value,
    onChange: onValueChange,
  });
  const isTypingRef = useRef(false);
  const [query, setQuery] = useState(() =>
    labelForId(value ?? defaultValue ?? SELECT_DEFAULT.value, options),
  );

  const restoreQuery = () => {
    isTypingRef.current = false;
    setQuery(labelForId(selectedId, options));
  };

  const handleClear = () => {
    isTypingRef.current = false;
    setQuery(SELECT_DEFAULT.value);
    setSelectedId(SELECT_DEFAULT.value);
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
        minCharsToSearch={SELECT_MIN_CHARS}
        toggleIcon={SELECT_SYMBOL.Toggle}
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
