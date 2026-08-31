import { forwardRef } from "react";
import { Combobox, type ComboboxProps, type Suggestion } from "./Combobox";
import { cn } from "../utils/cn";

export interface EntitySelectorProps extends Omit<ComboboxProps, "label"> {
  label: string;
  onEntitySelect?: (s: Suggestion) => void;
}

export const EntitySelector = forwardRef<HTMLInputElement, EntitySelectorProps>(
  function EntitySelector(
    { label, onEntitySelect, onSuggestionSelect, classNames, ...rest },
    ref,
  ) {
    return (
      <Combobox
        ref={ref}
        label={label}
        classNames={{
          ...classNames,
          root: cn("pr-entity-select", classNames?.root),
        }}
        onSuggestionSelect={(s) => {
          onEntitySelect?.(s);
          onSuggestionSelect?.(s);
        }}
        {...rest}
      />
    );
  },
);
