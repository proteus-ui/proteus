import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../utils/cn";
import type { ButtonIntent, ButtonProps, ButtonSize } from "./Button";

export type ToolbarSlot = "root";

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  classNames?: SlotClassNames<ToolbarSlot>;
}

export interface ToolbarButtonProps extends ButtonProps {
  pressed?: boolean;
}

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
  { classNames, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} role="toolbar" className={cn("pr-toolbar", classNames?.root, className)} {...rest}>
      {children}
    </div>
  );
});
Toolbar.displayName = "Toolbar";

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  function ToolbarButton(
    {
      intent = "neutral" satisfies ButtonIntent,
      size = "md" satisfies ButtonSize,
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
        className={cn("pr-toolbar__button", classNames?.root, className)}
        data-intent={intent}
        data-size={size}
        data-disabled={disabled ? "true" : undefined}
        disabled={disabled}
        type="button"
        {...rest}
        data-pressed={pressed ? "true" : undefined}
        aria-pressed={pressed !== undefined ? pressed : undefined}
      >
        {icon != null && (
          <span className={cn("pr-button__icon", classNames?.icon)} aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
      </button>
    );
  },
);
ToolbarButton.displayName = "ToolbarButton";
