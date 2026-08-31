import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../../utils/cn";

export type ButtonIntent = "neutral" | "primary" | "danger";
export type ButtonSize = "sm" | "md";
export type ButtonVariant = "solid" | "outline";
export type ButtonSlot = "root" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: ButtonIntent;
  size?: ButtonSize;
  icon?: ReactNode;
  classNames?: SlotClassNames<ButtonSlot>;
}

function createButton(variant: ButtonVariant) {
  return forwardRef<HTMLButtonElement, ButtonProps>(function ProteusButton(
    { intent = "neutral", size = "md", icon, classNames, className, children, disabled, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={cn("pr-button", classNames?.root, className)}
        data-intent={intent}
        data-size={size}
        data-variant={variant}
        data-disabled={disabled ? "true" : undefined}
        disabled={disabled}
        type="button"
        {...rest}
      >
        {icon != null && (
          <span className={cn("pr-button__icon", classNames?.icon)} aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
      </button>
    );
  });
}

export const Button = createButton("solid");
Button.displayName = "Button";

export const OutlineButton = createButton("outline");
OutlineButton.displayName = "OutlineButton";

export const IconButton = createButton("solid");
IconButton.displayName = "IconButton";
