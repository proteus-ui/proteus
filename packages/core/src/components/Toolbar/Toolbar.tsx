import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { DATA_TRUE, TOOLBAR_CLASS, TOOLBAR_DEFAULT, TOOLBAR_DISPLAY_NAME } from "./consts";
import type { ToolbarButtonProps, ToolbarProps } from "./types";

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
  { classNames, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} role="toolbar" className={cn(TOOLBAR_CLASS.root, classNames?.root, className)} {...rest}>
      {children}
    </div>
  );
});
Toolbar.displayName = TOOLBAR_DISPLAY_NAME.Toolbar;

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  function ToolbarButton(
    {
      intent = TOOLBAR_DEFAULT.intent,
      size = TOOLBAR_DEFAULT.size,
      icon,
      classNames,
      className,
      children,
      disabled,
      pressed,
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={cn(TOOLBAR_CLASS.button, classNames?.root, className)}
        data-intent={intent}
        data-size={size}
        data-disabled={disabled ? DATA_TRUE : undefined}
        disabled={disabled}
        type="button"
        {...rest}
        data-pressed={pressed ? DATA_TRUE : undefined}
        aria-pressed={pressed !== undefined ? pressed : undefined}
      >
        {icon != null && (
          <span className={cn(TOOLBAR_CLASS.icon, classNames?.icon)} aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
      </button>
    );
  },
);
ToolbarButton.displayName = TOOLBAR_DISPLAY_NAME.ToolbarButton;
