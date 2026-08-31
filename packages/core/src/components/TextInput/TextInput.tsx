import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../../utils/cn";
import { useControllableState } from "../../hooks/useControllableState";

export type TextInputSlot = "root" | "input";

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (next: string) => void;
  invalid?: boolean;
  classNames?: SlotClassNames<TextInputSlot>;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { value, defaultValue = "", onValueChange, invalid, classNames, className, ...rest },
  ref,
) {
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  return (
    <div
      className={cn("pr-input", classNames?.root)}
      data-invalid={invalid ? "true" : undefined}
    >
      <input
        ref={ref}
        {...rest}
        className={cn("pr-input__field", classNames?.input, className)}
        value={current}
        aria-invalid={invalid ? "true" : undefined}
        onChange={(e) => setCurrent(e.target.value)}
      />
    </div>
  );
});
