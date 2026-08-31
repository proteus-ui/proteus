import { forwardRef } from "react";
import { Combobox } from "../Combobox";
import { cn } from "../../utils/cn";
import { ENTITY_SELECTOR_CLASS } from "./consts";
import type { EntitySelectorProps } from "./types";

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
          root: cn(ENTITY_SELECTOR_CLASS.root, classNames?.root),
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
