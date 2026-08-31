import { useCallback, useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { useCloseOnEscape } from "../../hooks/useCloseOnEscape";
import { useCloseOnOutsideClick } from "../../hooks/useCloseOnOutsideClick";
import { AUTO_CLOSE } from "../../hooks/useCloseOnOutsideClick/consts";
import { useControllableState } from "../../hooks/useControllableState";
import { useSearchFilter } from "../../hooks/useSearchFilter";
import { cn } from "../../utils/cn";
import { KEYBOARD_KEYS } from "../../utils/keyboard";
import {
  ANNOUNCER_STYLE,
  DATA_TRUE,
  SELECT_CLASS,
  SELECT_DEFAULT,
  SELECT_DISPLAY_NAME,
  SELECT_LABEL,
  SELECT_OPTION_ID_SUFFIX,
  SELECT_OPTION_KEY_SEP,
  SELECT_STATE,
  SELECT_SYMBOL,
} from "./consts";
import type { SelectOption, SelectProps } from "./types";
import { formatOptionCount, isNavigationKey, labelForId, optionHaystack } from "./utils";

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
  const listboxId = useId();
  const labelId = useId();
  const inputId = useId();

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const togglerRef = useRef<HTMLButtonElement>(null);

  const [selectedId, setSelectedId] = useControllableState({
    value,
    defaultValue: defaultValue ?? SELECT_DEFAULT.value,
    onChange: onValueChange,
  });
  const [isTyping, setIsTyping] = useState(false);
  const [query, setQuery] = useState(() =>
    labelForId(value ?? defaultValue ?? SELECT_DEFAULT.value, options),
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const filtered = useSearchFilter(options, isTyping ? query : SELECT_DEFAULT.value, optionHaystack);

  const isEmpty = query.length === 0 && !isFocused;
  const showList = isOpen && !disabled;
  const canOpen = !disabled && options.length > 0;
  const optionValuesKey = filtered.map((s) => s.value).join(SELECT_OPTION_KEY_SEP);
  const resolvedHighlight =
    showList && highlightedIndex >= 0 && highlightedIndex < filtered.length ? highlightedIndex : -1;
  const activeDescendantId =
    resolvedHighlight >= 0
      ? `${listboxId}-${SELECT_OPTION_ID_SUFFIX}-${resolvedHighlight}`
      : undefined;

  const close = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  useEffect(() => {
    if (disabled) close();
  }, [disabled, close]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [optionValuesKey]);

  useEffect(() => {
    if (isTyping) return;
    setQuery(labelForId(selectedId, options));
  }, [selectedId, options, isTyping]);

  useCloseOnEscape(showList, close);
  useCloseOnOutsideClick(showList || isOpen, rootRef, close, {
    togglerRef,
    mode: AUTO_CLOSE.Outside,
  });

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const selectOption = (option: SelectOption) => {
    if (disabled) return;
    setIsTyping(false);
    setQuery(option.label);
    setSelectedId(option.value);
    close();
    focusInput();
  };

  const restoreQuery = () => {
    setIsTyping(false);
    setQuery(labelForId(selectedId, options));
  };

  const applyQuery = (next: string) => {
    if (disabled) return;
    setIsTyping(true);
    setQuery(next);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const openFromToggle = () => {
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleToggle = () => {
    if (showList) close();
    else if (canOpen) openFromToggle();
  };

  const handleClear = () => {
    if (disabled) return;
    setIsTyping(false);
    setQuery(SELECT_DEFAULT.value);
    setSelectedId(SELECT_DEFAULT.value);
    close();
    focusInput();
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    restoreQuery();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (!isNavigationKey(e.key)) return;

    switch (e.key) {
      case KEYBOARD_KEYS.ARROW_DOWN: {
        e.preventDefault();
        if (!showList) {
          if (!canOpen) return;
          setIsOpen(true);
          setHighlightedIndex(-1);
          return;
        }
        setHighlightedIndex((current) => {
          const last = filtered.length - 1;
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
        const highlighted = resolvedHighlight >= 0 ? filtered[resolvedHighlight] : undefined;
        if (highlighted) selectOption(highlighted);
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

  const announcerText =
    showList && filtered.length > 0
      ? formatOptionCount(filtered.length)
      : showList && filtered.length === 0 && isTyping && query.length > 0
        ? SELECT_LABEL.NoResults
        : "";

  const showClear = query.length > 0 && !disabled;
  const showToggle = !disabled && options.length > 0;
  const showNoResults = showList && filtered.length === 0 && isTyping && query.length > 0;

  return (
    <div
      ref={rootRef}
      className={cn(SELECT_CLASS.root, classNames?.root)}
      data-empty={isEmpty ? DATA_TRUE : undefined}
      data-invalid={invalid ? DATA_TRUE : undefined}
      data-state={showList ? SELECT_STATE.Open : SELECT_STATE.Closed}
      data-disabled={disabled ? DATA_TRUE : undefined}
      onBlur={handleBlur}
    >
      {label != null && label !== "" && (
        <label htmlFor={inputId} id={labelId} className={cn(SELECT_CLASS.label, classNames?.label)}>
          {label}
        </label>
      )}
      <div className={SELECT_CLASS.control}>
        <input
          ref={inputRef}
          id={inputId}
          role="combobox"
          className={cn(SELECT_CLASS.field, classNames?.input)}
          value={query}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          aria-expanded={showList}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls={showList && filtered.length > 0 ? listboxId : undefined}
          aria-activedescendant={activeDescendantId}
          aria-labelledby={label ? labelId : undefined}
          aria-invalid={invalid ? DATA_TRUE : undefined}
          onChange={(e) => applyQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (!disabled) {
              setIsOpen(true);
              setHighlightedIndex(-1);
            }
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
        />
        {showClear && (
          <button
            type="button"
            className={cn(SELECT_CLASS.clear, classNames?.clear)}
            aria-label={SELECT_LABEL.Clear}
            tabIndex={-1}
            onClick={handleClear}
          >
            {SELECT_SYMBOL.Clear}
          </button>
        )}
        {showToggle && (
          <button
            ref={togglerRef}
            type="button"
            className={cn(SELECT_CLASS.toggle, classNames?.toggle)}
            aria-label={showList ? SELECT_LABEL.CloseOptions : SELECT_LABEL.OpenOptions}
            aria-expanded={showList}
            tabIndex={-1}
            onPointerDown={(e) => e.preventDefault()}
            onClick={handleToggle}
          >
            {SELECT_SYMBOL.Toggle}
          </button>
        )}
        <div
          className={cn(SELECT_CLASS.announcer, classNames?.announcer)}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={ANNOUNCER_STYLE}
        >
          {announcerText}
        </div>
        {showList && filtered.length > 0 && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label={SELECT_LABEL.Options}
            className={cn(SELECT_CLASS.list, classNames?.list)}
          >
            {filtered.map((option, i) => {
              const selected = i === resolvedHighlight;
              return (
                <li
                  key={option.value}
                  id={`${listboxId}-${SELECT_OPTION_ID_SUFFIX}-${i}`}
                  role="option"
                  className={cn(SELECT_CLASS.option, classNames?.option)}
                  aria-selected={selected}
                  data-highlighted={selected ? DATA_TRUE : undefined}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => selectOption(option)}
                >
                  {option.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {showNoResults && <div role="status">{SELECT_LABEL.NoResults}</div>}
    </div>
  );
}

Select.displayName = SELECT_DISPLAY_NAME;
