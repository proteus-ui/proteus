import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../utils/cn";
import { useControllableState } from "../hooks/useControllableState";

export type SearchBarSlot = "root" | "input" | "clear";

export interface SearchBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (next: string) => void;
  onClear?: () => void;
  classNames?: SlotClassNames<SearchBarSlot>;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar(
  {
    value,
    defaultValue = "",
    onValueChange,
    onClear,
    classNames,
    className,
    disabled,
    readOnly,
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
      className={cn("pr-search", classNames?.root)}
      data-disabled={disabled ? "true" : undefined}
      data-readonly={readOnly ? "true" : undefined}
    >
      <input
        ref={ref}
        {...rest}
        type="search"
        disabled={disabled}
        readOnly={readOnly}
        className={cn("pr-search__field", classNames?.input, className)}
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
      />
      {current !== "" && !disabled && !readOnly && (
        <button
          type="button"
          aria-label="Clear search"
          className={cn("pr-search__clear", classNames?.clear)}
          onClick={() => {
            setCurrent("");
            onClear?.();
          }}
        >
          ×
        </button>
      )}
    </div>
  );
});
