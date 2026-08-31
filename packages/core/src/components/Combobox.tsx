import { forwardRef, useCallback, useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { useCloseOnOutsideClick } from "../hooks/useCloseOnOutsideClick";
import { useControllableState } from "../hooks/useControllableState";
import { cn } from "../utils/cn";
import { KEYBOARD_KEYS, NAVIGATION_KEYS } from "../utils/keyboard";

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

type NavigationKey = (typeof NAVIGATION_KEYS)[number];

const announcerStyle: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

function isNavigationKey(key: string): key is NavigationKey {
  return (NAVIGATION_KEYS as readonly string[]).includes(key);
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    value: valueProp,
    defaultValue = "",
    onValueChange,
    suggestions = [],
    isLoading = false,
    disabled = false,
    onlyDigits = false,
    placeholder,
    noResultsText = "No results found",
    minCharsToSearch = 2,
    invalid,
    errorMessage,
    hintMessage,
    label,
    onSuggestionSelect,
    onClear,
    classNames,
    toggleIcon,
  },
  ref,
) {
  const listboxId = useId();
  const labelId = useId();
  const errorId = useId();
  const hintId = useId();
  const inputId = useId();

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const togglerRef = useRef<HTMLButtonElement>(null);

  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [openedByToggle, setOpenedByToggle] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const isEmpty = value.length === 0 && !isFocused;
  const showList =
    isOpen &&
    !disabled &&
    !isLoading &&
    (value.length >= minCharsToSearch || (openedByToggle && suggestions.length > 0));
  const canOpen =
    !disabled && !isLoading && (value.length >= minCharsToSearch || suggestions.length > 0);
  const suggestionValuesKey = suggestions.map((s) => s.value).join("\0");
  const resolvedHighlight =
    showList && highlightedIndex >= 0 && highlightedIndex < suggestions.length
      ? highlightedIndex
      : -1;
  const activeDescendantId =
    resolvedHighlight >= 0 ? `${listboxId}-option-${resolvedHighlight}` : undefined;

  const close = useCallback(() => {
    setIsOpen(false);
    setOpenedByToggle(false);
    setHighlightedIndex(-1);
  }, []);

  useEffect(() => {
    if (disabled) close();
  }, [disabled, close]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [isLoading, suggestionValuesKey]);

  useCloseOnOutsideClick(showList || isOpen, rootRef, close, {
    togglerRef,
    mode: "outside",
  });

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const selectSuggestion = (suggestion: Suggestion) => {
    if (disabled || isLoading) return;
    setValue(suggestion.label);
    onSuggestionSelect?.(suggestion);
    close();
    focusInput();
  };

  const applyInputValue = (next: string) => {
    if (disabled) return;
    const filtered = onlyDigits ? next.replace(/\D+/g, "") : next;
    setValue(filtered);
    setIsOpen(true);
    setOpenedByToggle(false);
    setHighlightedIndex(-1);
  };

  const openFromToggle = () => {
    setIsOpen(true);
    setOpenedByToggle(true);
    setHighlightedIndex(-1);
  };

  const handleToggle = () => {
    if (showList) close();
    else if (canOpen) openFromToggle();
  };

  const handleClear = () => {
    if (disabled || isLoading) return;
    setValue("");
    close();
    onClear?.();
    focusInput();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (!isNavigationKey(e.key)) return;

    switch (e.key) {
      case KEYBOARD_KEYS.ARROW_DOWN: {
        e.preventDefault();
        if (!showList) {
          if (!canOpen) return;
          const treatAsToggle = value.length < minCharsToSearch && suggestions.length > 0;
          setIsOpen(true);
          setOpenedByToggle(treatAsToggle);
          setHighlightedIndex(-1);
          return;
        }
        setHighlightedIndex((current) => {
          const last = suggestions.length - 1;
          if (last < 0) return -1;
          return Math.min(current + 1, last);
        });
        return;
      }
      case KEYBOARD_KEYS.ARROW_UP: {
        e.preventDefault();
        if (highlightedIndex < 0) {
          close();
          return;
        }
        setHighlightedIndex((current) => Math.max(current - 1, -1));
        return;
      }
      case KEYBOARD_KEYS.ENTER: {
        e.preventDefault();
        const highlighted = resolvedHighlight >= 0 ? suggestions[resolvedHighlight] : undefined;
        if (highlighted) selectSuggestion(highlighted);
        return;
      }
      case KEYBOARD_KEYS.ESCAPE: {
        e.preventDefault();
        close();
        return;
      }
      case KEYBOARD_KEYS.TAB: {
        close();
        return;
      }
      default: {
        const _never: never = e.key;
        return _never;
      }
    }
  };

  const describedBy = [errorMessage ? errorId : undefined, hintMessage ? hintId : undefined]
    .filter(Boolean)
    .join(" ");

  const announcerText =
    showList && suggestions.length > 0
      ? `${suggestions.length} suggestion${suggestions.length === 1 ? "" : "s"} available`
      : showList && suggestions.length === 0 && value.length > 0
        ? noResultsText
        : "";

  const showClear = value.length > 0 && !disabled && !isLoading;
  const showToggle = !disabled && !isLoading && suggestions.length > 0 && toggleIcon;
  const showNoResults = showList && suggestions.length === 0 && value.length > 0;

  const setInputRefs = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <div
      ref={rootRef}
      className={cn("pr-combobox", classNames?.root)}
      data-empty={isEmpty ? "true" : undefined}
      data-invalid={invalid ? "true" : undefined}
      data-state={showList ? "open" : "closed"}
      data-disabled={disabled ? "true" : undefined}
    >
      {label != null && label !== "" && (
        <label htmlFor={inputId} id={labelId} className={cn("pr-combobox__label", classNames?.label)}>
          {label}
        </label>
      )}
      <input
        ref={setInputRefs}
        id={inputId}
        role="combobox"
        className={cn("pr-combobox__field", classNames?.input)}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        aria-expanded={showList}
        aria-haspopup="listbox"
        aria-autocomplete="list"
        aria-controls={showList ? listboxId : undefined}
        aria-activedescendant={activeDescendantId}
        aria-labelledby={label ? labelId : undefined}
        aria-invalid={invalid ? "true" : undefined}
        aria-describedby={describedBy || undefined}
        inputMode={onlyDigits ? "numeric" : undefined}
        pattern={onlyDigits ? "[0-9]*" : undefined}
        onChange={(e) => applyInputValue(e.target.value)}
        onFocus={() => {
          setIsFocused(true);
          if (!disabled && !isLoading && value.length >= minCharsToSearch) {
            setIsOpen(true);
            setOpenedByToggle(false);
            setHighlightedIndex(-1);
          }
        }}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
      />
      {showClear && (
        <button
          type="button"
          className={cn("pr-combobox__clear", classNames?.clear)}
          aria-label="Clear search"
          tabIndex={-1}
          onClick={handleClear}
        >
          ×
        </button>
      )}
      {showToggle && (
        <button
          ref={togglerRef}
          type="button"
          className={cn("pr-combobox__toggle", classNames?.toggle)}
          aria-label={showList ? "Close suggestions" : "Open suggestions"}
          aria-expanded={showList}
          tabIndex={-1}
          onPointerDown={(e) => e.preventDefault()}
          onClick={handleToggle}
        >
          {toggleIcon}
        </button>
      )}
      {isLoading && (
        <div role="status" aria-label="Loading suggestions">
          Loading suggestions
        </div>
      )}
      <div
        className={cn("pr-combobox__announcer", classNames?.announcer)}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={announcerStyle}
      >
        {announcerText}
      </div>
      {showList && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Suggestions"
          className={cn("pr-combobox__list", classNames?.list)}
        >
          {suggestions.map((suggestion, i) => {
            const selected = i === resolvedHighlight;
            return (
              <li
                key={suggestion.value}
                id={`${listboxId}-option-${i}`}
                role="option"
                className={cn("pr-combobox__option", classNames?.option)}
                aria-selected={selected}
                data-highlighted={selected ? "true" : undefined}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(suggestion)}
              >
                {suggestion.label}
              </li>
            );
          })}
        </ul>
      )}
      {showNoResults && <div role="status">{noResultsText}</div>}
      {errorMessage ? (
        <div id={errorId} role="alert" className={cn("pr-combobox__error", classNames?.error)}>
          {errorMessage}
        </div>
      ) : null}
      {hintMessage ? (
        <div id={hintId} className={cn("pr-combobox__hint", classNames?.hint)}>
          {hintMessage}
        </div>
      ) : null}
    </div>
  );
});

Combobox.displayName = "Combobox";
