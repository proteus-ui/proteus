"use client";

import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import {
  BUTTON_CLASS,
  BUTTON_DEFAULT,
  BUTTON_DISPLAY_NAME,
  BUTTON_ICON_PLACEMENT,
  DATA_TRUE,
} from "./consts";
import type { ButtonProps } from "./types";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    intent = BUTTON_DEFAULT.intent,
    size = BUTTON_DEFAULT.size,
    variant = BUTTON_DEFAULT.variant,
    icon,
    iconPlacement = BUTTON_DEFAULT.iconPlacement,
    classNames,
    className,
    children,
    disabled,
    ...rest
  },
  ref,
) {
  const iconEl =
    icon != null ? (
      <span className={cn(BUTTON_CLASS.icon, classNames?.icon)} aria-hidden="true">
        {icon}
      </span>
    ) : null;

  const prefix = iconPlacement === BUTTON_ICON_PLACEMENT.Prefix ? iconEl : null;
  const suffix = iconPlacement === BUTTON_ICON_PLACEMENT.Suffix ? iconEl : null;

  return (
    <button
      ref={ref}
      className={cn(BUTTON_CLASS.root, classNames?.root, className)}
      data-intent={intent}
      data-size={size}
      data-variant={variant}
      data-icon-placement={iconEl != null ? iconPlacement : undefined}
      data-disabled={disabled ? DATA_TRUE : undefined}
      disabled={disabled}
      type="button"
      {...rest}
    >
      {prefix}
      {children}
      {suffix}
    </button>
  );
});
Button.displayName = BUTTON_DISPLAY_NAME.Button;

export const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(function IconButton(props, ref) {
  return <Button ref={ref} {...props} />;
});
IconButton.displayName = BUTTON_DISPLAY_NAME.IconButton;
