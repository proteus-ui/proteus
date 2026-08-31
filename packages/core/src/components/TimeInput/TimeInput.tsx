import { forwardRef, useEffect, useId, useRef, useState } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { useControllableState } from "../../hooks/useControllableState";
import { cn } from "../../utils/cn";

export type TimeInputSlot = "root" | "input" | "error";

export interface TimeInputProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  errorMessage?: string;
  label?: string;
  classNames?: SlotClassNames<TimeInputSlot>;
}

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(function TimeInput(
  {
    value,
    defaultValue = "",
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
      className={cn("pr-time", classNames?.root)}
      data-invalid={invalid ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
      data-empty={isEmpty ? "true" : undefined}
    >
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        placeholder="HH:MM"
        autoComplete="off"
        disabled={disabled}
        aria-label={label}
        aria-invalid={invalid ? "true" : undefined}
        aria-describedby={errorMessage ? errorId : undefined}
        className={cn("pr-time__field", classNames?.input)}
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
        <div id={errorId} role="alert" className={cn("pr-time__error", classNames?.error)}>
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
});
