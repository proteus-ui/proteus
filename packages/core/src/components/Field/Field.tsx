import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
} from "react";
import { cn } from "../../utils/cn";
import { DATA_TRUE, FIELD_CLASS, FIELD_DISPLAY_NAME } from "./consts";
import type { FieldProps } from "./types";

type ControlProps = {
  id?: string;
  "aria-describedby"?: string;
};

function mergeDescribedBy(
  existing: string | undefined,
  ...ids: Array<string | undefined>
): string | undefined {
  const merged = [existing, ...ids].filter(Boolean).join(" ");
  return merged.length > 0 ? merged : undefined;
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  {
    label,
    children,
    hint,
    error,
    invalid,
    htmlFor,
    classNames,
    className,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const controlId = htmlFor ?? generatedId;
  const hintId = hint != null ? `${controlId}-hint` : undefined;
  const errorId = error != null ? `${controlId}-error` : undefined;
  const isInvalid = Boolean(invalid) || error != null;

  const childArray = Children.toArray(children);
  const onlyChild = childArray.length === 1 ? childArray[0] : null;
  const control = isValidElement<ControlProps>(onlyChild)
    ? cloneElement(onlyChild, {
        id: onlyChild.props.id ?? controlId,
        "aria-describedby": mergeDescribedBy(
          onlyChild.props["aria-describedby"],
          hintId,
          errorId,
        ),
      })
    : children;

  return (
    <div
      ref={ref}
      className={cn(FIELD_CLASS.root, classNames?.root, className)}
      data-invalid={isInvalid ? DATA_TRUE : undefined}
      {...rest}
    >
      {label != null && (
        <label htmlFor={controlId} className={cn(FIELD_CLASS.label, classNames?.label)}>
          {label}
        </label>
      )}
      <div className={cn(FIELD_CLASS.control, classNames?.control)}>{control}</div>
      {hint != null && (
        <span id={hintId} className={cn(FIELD_CLASS.hint, classNames?.hint)}>
          {hint}
        </span>
      )}
      {error != null && (
        <span
          id={errorId}
          className={cn(FIELD_CLASS.error, classNames?.error)}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
});

Field.displayName = FIELD_DISPLAY_NAME;
