import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import {
  BUTTON_CLASS,
  BUTTON_DEFAULT,
  BUTTON_DISPLAY_NAME,
  DATA_TRUE,
} from "./consts";
import type { ButtonProps } from "./types";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    intent = BUTTON_DEFAULT.intent,
    size = BUTTON_DEFAULT.size,
    variant = BUTTON_DEFAULT.variant,
    icon,
    classNames,
    className,
    children,
    disabled,
    ...rest
  },
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
Button.displayName = BUTTON_DISPLAY_NAME.Button;

export const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(function IconButton(props, ref) {
  return <Button ref={ref} {...props} />;
});
IconButton.displayName = BUTTON_DISPLAY_NAME.IconButton;
