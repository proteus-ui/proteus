import { forwardRef, useEffect, useId, useRef, useState } from "react";
import { useControllableState } from "../../hooks/useControllableState";
import { cn } from "../../utils/cn";
import {
  DATA_TRUE,
  TIME_INPUT_CLASS,
  TIME_INPUT_DEFAULT,
  TIME_INPUT_PLACEHOLDER,
  TIME_RE,
} from "./consts";
import type { TimeInputProps } from "./types";

export const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(function TimeInput(
  {
    value,
    defaultValue = TIME_INPUT_DEFAULT.value,
    onValueChange,
    disabled,
    invalid,
    errorMessage,
    label,
    classNames,
  },
  ref,
) {
  const [committed, setCommitted] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const [draft, setDraft] = useState(committed);
  const [focused, setFocused] = useState(false);
  const focusedRef = useRef(false);
  const errorId = useId();

  useEffect(() => {
    if (!focusedRef.current) setDraft(committed);
  }, [committed]);

  const isEmpty = draft.length === 0 && !focused;

  return (
    <div
      className={cn(TIME_INPUT_CLASS.root, classNames?.root)}
      data-invalid={invalid ? DATA_TRUE : undefined}
      data-disabled={disabled ? DATA_TRUE : undefined}
      data-empty={isEmpty ? DATA_TRUE : undefined}
    >
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        placeholder={TIME_INPUT_PLACEHOLDER}
        autoComplete="off"
        disabled={disabled}
        aria-label={label}
        aria-invalid={invalid ? DATA_TRUE : undefined}
        aria-describedby={errorMessage ? errorId : undefined}
        className={cn(TIME_INPUT_CLASS.field, classNames?.input)}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onFocus={() => {
          focusedRef.current = true;
          setFocused(true);
        }}
        onBlur={() => {
          focusedRef.current = false;
          setFocused(false);
          if (TIME_RE.test(draft)) {
            setCommitted(draft);
          } else {
            setDraft(committed);
          }
        }}
      />
      {errorMessage ? (
        <div id={errorId} role="alert" className={cn(TIME_INPUT_CLASS.error, classNames?.error)}>
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
});
