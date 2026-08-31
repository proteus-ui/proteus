import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../utils/cn";
import { KEYBOARD_KEYS } from "../utils/keyboard";

export type OtpInputSlot = "root" | "cell" | "error";

export interface OtpInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  onBlur?: () => void;
  onValidate?: (value: string, index?: number) => boolean;
  otpLength?: number;
  disabled?: boolean;
  shouldAutoFocus?: boolean;
  invalid?: boolean;
  errorMessage?: string;
  ariaLabel?: string;
  className?: string;
  classNames?: SlotClassNames<OtpInputSlot>;
}

function toCells(joined: string, length: number): string[] {
  const cells = joined.split("").slice(0, length);
  while (cells.length < length) cells.push("");
  return cells;
}

function resizeCells(cells: string[], length: number): string[] {
  if (cells.length === length) return cells;
  const next = cells.slice(0, length);
  while (next.length < length) next.push("");
  return next;
}

export const OtpInput = forwardRef<HTMLDivElement, OtpInputProps>(function OtpInput(
  {
    value,
    defaultValue = "",
    onChange,
    onComplete,
    onBlur,
    onValidate,
    otpLength = 6,
    disabled = false,
    shouldAutoFocus = true,
    invalid = false,
    errorMessage,
    ariaLabel = "One-time code",
    className,
    classNames,
  },
  ref,
) {
  const [cells, setCells] = useState(() => toCells(value ?? defaultValue, otpLength));
  const [validationFailed, setValidationFailed] = useState(false);
  const uid = useId();
  const errorId = `${uid}-error`;
  const groupRef = useRef<HTMLDivElement | null>(null);
  const cellRefs = useRef<Array<HTMLInputElement | null>>([]);
  const shouldRedirectFocus = useRef(true);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCommitJoined = useRef<string | null>(null);
  const onValidateRef = useRef(onValidate);
  onValidateRef.current = onValidate;
  const isInvalid = invalid || validationFailed;

  useEffect(() => {
    setCells((prev) => {
      const sized = resizeCells(prev, otpLength);
      if (value !== undefined && sized.join("") !== value) return toCells(value, otpLength);
      return sized;
    });
  }, [value, otpLength]);

  useEffect(() => {
    if (value === undefined) return;
    if (lastCommitJoined.current === value) {
      lastCommitJoined.current = null;
      return;
    }
    const validate = onValidateRef.current;
    if (!validate) {
      setValidationFailed(false);
      return;
    }
    setValidationFailed(validate(value) === false);
  }, [value]);

  useEffect(() => {
    if (!shouldAutoFocus || disabled) return;
    const firstEmpty = cells.findIndex((c) => c === "");
    const target = firstEmpty === -1 ? 0 : firstEmpty;
    cellRefs.current[target]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- harvest autofocus is mount-only
  }, []);

  useEffect(() => {
    return () => {
      if (blurTimer.current != null) clearTimeout(blurTimer.current);
    };
  }, []);

  const setGroupRef = (node: HTMLDivElement | null) => {
    groupRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const applyValidation = (nextJoined: string, index?: number) => {
    if (!onValidate) {
      setValidationFailed(false);
      return;
    }
    setValidationFailed(onValidate(nextJoined, index) === false);
  };

  const commit = (nextCells: string[], validateIndex?: number) => {
    const nextJoined = nextCells.join("");
    lastCommitJoined.current = nextJoined;
    setCells(nextCells);
    onChange?.(nextJoined);
    applyValidation(nextJoined, validateIndex);
    if (nextCells.every((c) => c !== "")) onComplete?.(nextJoined);
  };

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    let next = e.target.value;
    if (next.length > 1) next = next.slice(-1);
    if (next !== "" && !/^\d$/.test(next)) return;

    const nextCells = cells.map((c, i) => (i === index ? next : c));
    commit(nextCells, index);

    if (next !== "" && index < otpLength - 1) {
      shouldRedirectFocus.current = false;
      cellRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, otpLength);
    const nextCells = cells.map((c, i) => (i < digits.length ? digits[i]! : c));
    commit(nextCells);
    shouldRedirectFocus.current = false;
    cellRefs.current[Math.min(digits.length, otpLength - 1)]?.focus();
  };

  const handleFocus = (index: number) => {
    if (blurTimer.current != null) {
      clearTimeout(blurTimer.current);
      blurTimer.current = null;
    }
    if (shouldRedirectFocus.current) {
      const firstEmpty = cells.findIndex((c) => c === "");
      const target = firstEmpty === -1 ? otpLength - 1 : firstEmpty;
      if (target !== index) {
        cellRefs.current[target]?.focus();
      }
    }
    shouldRedirectFocus.current = true;
  };

  const handleBlur = () => {
    if (blurTimer.current != null) clearTimeout(blurTimer.current);
    blurTimer.current = setTimeout(() => {
      if (groupRef.current && !groupRef.current.contains(document.activeElement)) {
        onBlur?.();
      }
    }, 0);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KEYBOARD_KEYS.BACKSPACE) {
      if (cells[index] === "" && index > 0) {
        shouldRedirectFocus.current = false;
        cellRefs.current[index - 1]?.focus();
      }
      return;
    }
    if (e.key === KEYBOARD_KEYS.ARROW_LEFT && index > 0) {
      shouldRedirectFocus.current = false;
      cellRefs.current[index - 1]?.focus();
      return;
    }
    if (e.key === KEYBOARD_KEYS.ARROW_RIGHT && index < otpLength - 1) {
      shouldRedirectFocus.current = false;
      cellRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div
      ref={setGroupRef}
      role="group"
      aria-label={ariaLabel}
      aria-describedby={errorMessage ? errorId : undefined}
      className={cn("pr-otp", classNames?.root, className)}
      data-invalid={isInvalid ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
    >
      {cells.map((cell, index) => (
        <input
          key={`${uid}-cell-${index}`}
          id={`${uid}-cell-${index}`}
          ref={(node) => {
            cellRefs.current[index] = node;
          }}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          disabled={disabled}
          aria-invalid={isInvalid ? "true" : undefined}
          className={cn("pr-otp__cell", classNames?.cell)}
          value={cell}
          onChange={(e) => handleChange(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          onBlur={handleBlur}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />
      ))}
      {errorMessage ? (
        <div id={errorId} role="alert" className={cn("pr-otp__error", classNames?.error)}>
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
});
