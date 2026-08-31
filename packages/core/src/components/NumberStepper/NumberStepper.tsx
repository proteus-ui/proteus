import { forwardRef, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { useControllableState } from "../../hooks/useControllableState";
import { cn } from "../../utils/cn";
import { KEYBOARD_KEYS } from "../../utils/keyboard";

export type NumberStepperSlot = "root" | "input" | "inc" | "dec";

export interface NumberStepperProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  invalid?: boolean;
  label?: string;
  classNames?: SlotClassNames<NumberStepperSlot>;
}

function decimalPlaces(step: number): number {
  if (!Number.isFinite(step)) return 0;
  const text = step.toString().toLowerCase();
  if (text.includes("e-")) {
    const [base = "", exp = "0"] = text.split("e-");
    return Number(exp) + (base.split(".")[1] ?? "").length;
  }
  return (text.split(".")[1] ?? "").length;
}

function add(n: number, delta: number, step: number): number {
  const places = Math.max(decimalPlaces(n), decimalPlaces(delta), decimalPlaces(step));
  return Number((n + delta).toFixed(places));
}

function parseDraft(draft: string): number | undefined {
  if (draft.trim() === "") return undefined;
  const parsed = Number(draft);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export const NumberStepper = forwardRef<HTMLInputElement, NumberStepperProps>(function NumberStepper(
  {
    value,
    defaultValue = 0,
    onValueChange,
    min,
    max,
    step = 1,
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
      case "Home":
        if (min !== undefined) {
          e.preventDefault();
          commit(min);
        }
        return;
      case "End":
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
      className={cn("pr-stepper", classNames?.root)}
      role="group"
      aria-label={label}
      data-invalid={invalid ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
    >
      <button
        type="button"
        aria-label="Decrease value"
        className={cn("pr-stepper__dec", classNames?.dec)}
        disabled={disabled}
        onPointerDown={(e) => e.preventDefault()}
        onClick={() => commit(add(liveValue(), -step, step))}
      >
        −
      </button>
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        role="spinbutton"
        className={cn("pr-stepper__field", classNames?.input)}
        value={draft}
        disabled={disabled}
        aria-valuenow={current}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-invalid={invalid ? "true" : undefined}
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
        aria-label="Increase value"
        className={cn("pr-stepper__inc", classNames?.inc)}
        disabled={disabled}
        onPointerDown={(e) => e.preventDefault()}
        onClick={() => commit(add(liveValue(), step, step))}
      >
        +
      </button>
    </div>
  );
});
