import { forwardRef, useEffect, useRef } from "react";
import { cn } from "../../utils/cn";
import { useControllableState } from "../../hooks/useControllableState";
import { CHECKBOX_CLASS, CHECKBOX_DEFAULT, DATA_TRUE } from "./consts";
import type { CheckboxProps } from "./types";

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    checked,
    defaultChecked = CHECKBOX_DEFAULT.checked,
    onCheckedChange,
    indeterminate,
    invalid,
    label,
    disabled,
    classNames,
    className,
    ...rest
  },
  ref,
) {
  const [current, setCurrent] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate, current]);

  return (
    <label
      className={cn(CHECKBOX_CLASS.root, classNames?.root, className)}
      data-invalid={invalid ? DATA_TRUE : undefined}
      data-disabled={disabled ? DATA_TRUE : undefined}
      data-checked={current ? DATA_TRUE : undefined}
      data-indeterminate={indeterminate ? DATA_TRUE : undefined}
    >
      <input
        ref={(node) => {
          inputRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        {...rest}
        type="checkbox"
        className={cn(CHECKBOX_CLASS.input, classNames?.input)}
        checked={current}
        disabled={disabled}
        aria-invalid={invalid ? DATA_TRUE : undefined}
        onChange={(event) => setCurrent(event.target.checked)}
      />
      {label != null && (
        <span className={cn(CHECKBOX_CLASS.label, classNames?.label)}>{label}</span>
      )}
    </label>
  );
});
