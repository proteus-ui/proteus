import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { useControllableState } from "../../hooks/useControllableState";
import { DATA_TRUE, TEXTAREA_CLASS, TEXTAREA_DEFAULT } from "./consts";
import type { TextareaProps } from "./types";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    value,
    defaultValue = TEXTAREA_DEFAULT.value,
    onValueChange,
    invalid,
    classNames,
    className,
    ...rest
  },
  ref,
) {
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  return (
    <div
      className={cn(TEXTAREA_CLASS.root, classNames?.root)}
      data-invalid={invalid ? DATA_TRUE : undefined}
    >
      <textarea
        ref={ref}
        {...rest}
        className={cn(TEXTAREA_CLASS.field, classNames?.field, className)}
        value={current}
        aria-invalid={invalid ? DATA_TRUE : undefined}
        onChange={(event) => setCurrent(event.target.value)}
      />
    </div>
  );
});
