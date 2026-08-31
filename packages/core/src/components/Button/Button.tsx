import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import {
  BUTTON_CLASS,
  BUTTON_DEFAULT,
  BUTTON_DISPLAY_NAME,
  BUTTON_VARIANT,
  DATA_TRUE,
} from "./consts";
import type { ButtonProps, ButtonVariant } from "./types";

function createButton(variant: ButtonVariant) {
  return forwardRef<HTMLButtonElement, ButtonProps>(function ProteusButton(
    { intent = BUTTON_DEFAULT.intent, size = BUTTON_DEFAULT.size, icon, classNames, className, children, disabled, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={cn(BUTTON_CLASS.root, classNames?.root, className)}
        data-intent={intent}
        data-size={size}
        data-variant={variant}
        data-disabled={disabled ? DATA_TRUE : undefined}
        disabled={disabled}
        type="button"
        {...rest}
      >
        {icon != null && (
          <span className={cn(BUTTON_CLASS.icon, classNames?.icon)} aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
      </button>
    );
  });
}

export const Button = createButton(BUTTON_VARIANT.Solid);
Button.displayName = BUTTON_DISPLAY_NAME.Button;

export const OutlineButton = createButton(BUTTON_VARIANT.Outline);
OutlineButton.displayName = BUTTON_DISPLAY_NAME.OutlineButton;

export const IconButton = createButton(BUTTON_VARIANT.Solid);
IconButton.displayName = BUTTON_DISPLAY_NAME.IconButton;
