import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../../utils/cn";

export type BadgeIntent = "neutral" | "primary" | "danger";
export type BadgeSlot = "root";
export type BadgeVariant = "badge" | "pill";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  intent?: BadgeIntent;
  classNames?: SlotClassNames<BadgeSlot>;
  children?: ReactNode;
}

function createBadge(variant: BadgeVariant) {
  return forwardRef<HTMLSpanElement, BadgeProps>(function ProteusBadge(
    { intent = "neutral", classNames, className, children, ...rest },
    ref,
  ) {
    return (
      <span
        ref={ref}
        className={cn("pr-badge", classNames?.root, className)}
        data-intent={intent}
        data-variant={variant}
        {...rest}
      >
        {children}
      </span>
    );
  });
}

export const Badge = createBadge("badge");
Badge.displayName = "Badge";

export const Pill = createBadge("pill");
Pill.displayName = "Pill";
