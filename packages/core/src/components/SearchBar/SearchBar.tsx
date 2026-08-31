import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { useControllableState } from "../../hooks/useControllableState";
import {
  DATA_TRUE,
  SEARCH_BAR_CLASS,
  SEARCH_BAR_DEFAULT,
  SEARCH_BAR_LABEL,
  SEARCH_BAR_SYMBOL,
} from "./consts";
import type { SearchBarProps } from "./types";

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar(
  {
    value,
    defaultValue = SEARCH_BAR_DEFAULT.value,
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
      className={cn(SEARCH_BAR_CLASS.root, classNames?.root)}
      data-disabled={disabled ? DATA_TRUE : undefined}
      data-readonly={readOnly ? DATA_TRUE : undefined}
    >
      <input
        ref={ref}
        {...rest}
        type="search"
        disabled={disabled}
        readOnly={readOnly}
        className={cn(SEARCH_BAR_CLASS.field, classNames?.input, className)}
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
      />
      {current !== SEARCH_BAR_DEFAULT.value && !disabled && !readOnly && (
        <button
          type="button"
          aria-label={SEARCH_BAR_LABEL.Clear}
          className={cn(SEARCH_BAR_CLASS.clear, classNames?.clear)}
          onClick={() => {
            setCurrent(SEARCH_BAR_DEFAULT.value);
            onClear?.();
          }}
        >
          {SEARCH_BAR_SYMBOL.Clear}
        </button>
      )}
    </div>
  );
});
