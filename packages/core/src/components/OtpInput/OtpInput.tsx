import { forwardRef, useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";
import { cn } from "../../utils/cn";
import { KEYBOARD_KEYS } from "../../utils/keyboard";
import {
  DATA_TRUE,
  OTP_CELL_ID_SUFFIX,
  OTP_DIGIT_RE,
  OTP_ERROR_ID_SUFFIX,
  OTP_INPUT_CLASS,
  OTP_INPUT_DEFAULT,
  OTP_NON_DIGIT_RE,
  OTP_CELL_PATTERN,
} from "./consts";
import type { OtpInputProps } from "./types";
import { resizeCells, toCells } from "./utils";

export const OtpInput = forwardRef<HTMLDivElement, OtpInputProps>(function OtpInput(
  {
    value,
    defaultValue = OTP_INPUT_DEFAULT.value,
    onChange,
    onComplete,
    onBlur,
    onValidate,
    otpLength = OTP_INPUT_DEFAULT.length,
    disabled = OTP_INPUT_DEFAULT.disabled,
    shouldAutoFocus = OTP_INPUT_DEFAULT.shouldAutoFocus,
    invalid = OTP_INPUT_DEFAULT.invalid,
    errorMessage,
    ariaLabel = OTP_INPUT_DEFAULT.ariaLabel,
    className,
    classNames,
  },
  ref,
) {
  const [cells, setCells] = useState(() => toCells(value ?? defaultValue, otpLength));
  const [validationFailed, setValidationFailed] = useState(false);
  const uid = useId();
  const errorId = `${uid}-${OTP_ERROR_ID_SUFFIX}`;
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
    if (next !== "" && !OTP_DIGIT_RE.test(next)) return;

    const nextCells = cells.map((c, i) => (i === index ? next : c));
    commit(nextCells, index);

    if (next !== "" && index < otpLength - 1) {
      shouldRedirectFocus.current = false;
      cellRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(OTP_NON_DIGIT_RE, "").slice(0, otpLength);
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
      className={cn(OTP_INPUT_CLASS.root, classNames?.root, className)}
      data-invalid={isInvalid ? DATA_TRUE : undefined}
      data-disabled={disabled ? DATA_TRUE : undefined}
    >
      {cells.map((cell, index) => (
        <input
          key={`${uid}-${OTP_CELL_ID_SUFFIX}-${index}`}
          id={`${uid}-${OTP_CELL_ID_SUFFIX}-${index}`}
          ref={(node) => {
            cellRefs.current[index] = node;
          }}
          type="tel"
          inputMode="numeric"
          pattern={OTP_CELL_PATTERN}
          maxLength={1}
          disabled={disabled}
          aria-invalid={isInvalid ? DATA_TRUE : undefined}
          className={cn(OTP_INPUT_CLASS.cell, classNames?.cell)}
          value={cell}
          onChange={(e) => handleChange(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          onBlur={handleBlur}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />
      ))}
      {errorMessage ? (
        <div id={errorId} role="alert" className={cn(OTP_INPUT_CLASS.error, classNames?.error)}>
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
});
