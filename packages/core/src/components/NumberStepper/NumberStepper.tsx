import { forwardRef, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useControllableState } from "../../hooks/useControllableState";
import { cn } from "../../utils/cn";
import { KEYBOARD_KEYS } from "../../utils/keyboard";
import {
  DATA_TRUE,
  NUMBER_STEPPER_CLASS,
  NUMBER_STEPPER_DEFAULT,
  NUMBER_STEPPER_LABEL,
  NUMBER_STEPPER_SYMBOL,
} from "./consts";
import type { NumberStepperProps } from "./types";
import { add, parseDraft } from "./utils";

export const NumberStepper = forwardRef<HTMLInputElement, NumberStepperProps>(function NumberStepper(
  {
    value,
    defaultValue = NUMBER_STEPPER_DEFAULT.value,
    onValueChange,
    min,
    max,
    step = NUMBER_STEPPER_DEFAULT.step,
    disabled,
    invalid,
    label,
    classNames,
  },
  ref,
) {
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const [draft, setDraft] = useState(() => String(current));
  const editingRef = useRef(false);

  useEffect(() => {
    if (!editingRef.current) setDraft(String(current));
  }, [current]);

  const clamp = (n: number) => {
    let next = n;
    if (min !== undefined) next = Math.max(min, next);
    if (max !== undefined) next = Math.min(max, next);
    return next;
  };

  const commit = (n: number) => {
    const next = clamp(n);
    setCurrent(next);
    setDraft(String(next));
  };

  const liveValue = () => parseDraft(draft) ?? current;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    switch (e.key) {
      case KEYBOARD_KEYS.ARROW_UP:
        e.preventDefault();
        commit(add(liveValue(), step, step));
        return;
      case KEYBOARD_KEYS.ARROW_DOWN:
        e.preventDefault();
        commit(add(liveValue(), -step, step));
        return;
      case KEYBOARD_KEYS.HOME:
        if (min !== undefined) {
          e.preventDefault();
          commit(min);
        }
        return;
      case KEYBOARD_KEYS.END:
        if (max !== undefined) {
          e.preventDefault();
          commit(max);
        }
        return;
      default:
        return;
    }
  };

  return (
    <div
      className={cn(NUMBER_STEPPER_CLASS.root, classNames?.root)}
      role="group"
      aria-label={label}
      data-invalid={invalid ? DATA_TRUE : undefined}
      data-disabled={disabled ? DATA_TRUE : undefined}
    >
      <button
        type="button"
        aria-label={NUMBER_STEPPER_LABEL.Decrease}
        className={cn(NUMBER_STEPPER_CLASS.dec, classNames?.dec)}
        disabled={disabled}
        onPointerDown={(e) => e.preventDefault()}
        onClick={() => commit(add(liveValue(), -step, step))}
      >
        {NUMBER_STEPPER_SYMBOL.Decrease}
      </button>
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        role="spinbutton"
        className={cn(NUMBER_STEPPER_CLASS.field, classNames?.input)}
        value={draft}
        disabled={disabled}
        aria-valuenow={current}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-invalid={invalid ? DATA_TRUE : undefined}
        onFocus={() => {
          editingRef.current = true;
        }}
        onBlur={() => {
          editingRef.current = false;
          const parsed = parseDraft(draft);
          if (parsed === undefined) {
            setDraft(String(current));
            return;
          }
          commit(parsed);
        }}
        onKeyDown={handleKeyDown}
        onChange={(e) => setDraft(e.target.value)}
      />
      <button
        type="button"
        aria-label={NUMBER_STEPPER_LABEL.Increase}
        className={cn(NUMBER_STEPPER_CLASS.inc, classNames?.inc)}
        disabled={disabled}
        onPointerDown={(e) => e.preventDefault()}
        onClick={() => commit(add(liveValue(), step, step))}
      >
        {NUMBER_STEPPER_SYMBOL.Increase}
      </button>
    </div>
  );
});
