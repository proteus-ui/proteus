import { forwardRef, useCallback, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useCloseOnOutsideClick } from "../../hooks/useCloseOnOutsideClick";
import { AUTO_CLOSE } from "../../hooks/useCloseOnOutsideClick/consts";
import { useControllableState } from "../../hooks/useControllableState";
import { cn } from "../../utils/cn";
import { KEYBOARD_KEYS } from "../../utils/keyboard";
import {
  ANNOUNCER_STYLE,
  COMBOBOX_CLASS,
  COMBOBOX_DEFAULT,
  COMBOBOX_LABEL,
  COMBOBOX_OPTION_ID_SUFFIX,
  COMBOBOX_PATTERN,
  COMBOBOX_STATE,
  COMBOBOX_SUGGESTION_KEY_SEP,
  COMBOBOX_SYMBOL,
  COMBOBOX_DISPLAY_NAME,
  DATA_TRUE,
} from "./consts";
import type { ComboboxProps, Suggestion } from "./types";
import { formatSuggestionCount, isNavigationKey } from "./utils";

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    value: valueProp,
    defaultValue = COMBOBOX_DEFAULT.value,
    onValueChange,
    suggestions = [],
    isLoading = COMBOBOX_DEFAULT.isLoading,
    disabled = COMBOBOX_DEFAULT.disabled,
    onlyDigits = COMBOBOX_DEFAULT.onlyDigits,
    placeholder,
    noResultsText = COMBOBOX_DEFAULT.noResultsText,
    minCharsToSearch = COMBOBOX_DEFAULT.minCharsToSearch,
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
  const suggestionValuesKey = suggestions.map((s) => s.value).join(COMBOBOX_SUGGESTION_KEY_SEP);
  const resolvedHighlight =
    showList && highlightedIndex >= 0 && highlightedIndex < suggestions.length
      ? highlightedIndex
      : -1;
  const activeDescendantId =
    resolvedHighlight >= 0
      ? `${listboxId}-${COMBOBOX_OPTION_ID_SUFFIX}-${resolvedHighlight}`
      : undefined;

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
    mode: AUTO_CLOSE.Outside,
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
    const filtered = onlyDigits ? next.replace(COMBOBOX_PATTERN.NonDigits, "") : next;
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
    setValue(COMBOBOX_DEFAULT.value);
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
      ? formatSuggestionCount(suggestions.length)
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
      className={cn(COMBOBOX_CLASS.root, classNames?.root)}
      data-empty={isEmpty ? DATA_TRUE : undefined}
      data-invalid={invalid ? DATA_TRUE : undefined}
      data-state={showList ? COMBOBOX_STATE.Open : COMBOBOX_STATE.Closed}
      data-disabled={disabled ? DATA_TRUE : undefined}
    >
      {label != null && label !== "" && (
        <label htmlFor={inputId} id={labelId} className={cn(COMBOBOX_CLASS.label, classNames?.label)}>
          {label}
        </label>
      )}
      <div className={COMBOBOX_CLASS.control}>
      <input
        ref={setInputRefs}
        id={inputId}
        role="combobox"
        className={cn(COMBOBOX_CLASS.field, classNames?.input)}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        aria-expanded={showList}
        aria-haspopup="listbox"
        aria-autocomplete="list"
        aria-controls={showList && suggestions.length > 0 ? listboxId : undefined}
        aria-activedescendant={activeDescendantId}
        aria-labelledby={label ? labelId : undefined}
        aria-invalid={invalid ? DATA_TRUE : undefined}
        aria-describedby={describedBy || undefined}
        inputMode={onlyDigits ? "numeric" : undefined}
        pattern={onlyDigits ? COMBOBOX_PATTERN.Digits : undefined}
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
          className={cn(COMBOBOX_CLASS.clear, classNames?.clear)}
          aria-label={COMBOBOX_LABEL.Clear}
          tabIndex={-1}
          onClick={handleClear}
        >
          {COMBOBOX_SYMBOL.Clear}
        </button>
      )}
      {showToggle && (
        <button
          ref={togglerRef}
          type="button"
          className={cn(COMBOBOX_CLASS.toggle, classNames?.toggle)}
          aria-label={showList ? COMBOBOX_LABEL.CloseSuggestions : COMBOBOX_LABEL.OpenSuggestions}
          aria-expanded={showList}
          tabIndex={-1}
          onPointerDown={(e) => e.preventDefault()}
          onClick={handleToggle}
        >
          {toggleIcon}
        </button>
      )}
      {isLoading && (
        <div role="status" aria-label={COMBOBOX_LABEL.Loading}>
          {COMBOBOX_LABEL.Loading}
        </div>
      )}
      <div
        className={cn(COMBOBOX_CLASS.announcer, classNames?.announcer)}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={ANNOUNCER_STYLE}
      >
        {announcerText}
      </div>
      {showList && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={COMBOBOX_LABEL.Suggestions}
          className={cn(COMBOBOX_CLASS.list, classNames?.list)}
        >
          {suggestions.map((suggestion, i) => {
            const selected = i === resolvedHighlight;
            return (
              <li
                key={suggestion.value}
                id={`${listboxId}-${COMBOBOX_OPTION_ID_SUFFIX}-${i}`}
                role="option"
                className={cn(COMBOBOX_CLASS.option, classNames?.option)}
                aria-selected={selected}
                data-highlighted={selected ? DATA_TRUE : undefined}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(suggestion)}
              >
                {suggestion.label}
              </li>
            );
          })}
        </ul>
      )}
      </div>
      {showNoResults && <div role="status">{noResultsText}</div>}
      {errorMessage ? (
        <div id={errorId} role="alert" className={cn(COMBOBOX_CLASS.error, classNames?.error)}>
          {errorMessage}
        </div>
      ) : null}
      {hintMessage ? (
        <div id={hintId} className={cn(COMBOBOX_CLASS.hint, classNames?.hint)}>
          {hintMessage}
        </div>
      ) : null}
    </div>
  );
});

Combobox.displayName = COMBOBOX_DISPLAY_NAME;
