import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { BADGE_CLASS, BADGE_DEFAULT, BADGE_DISPLAY_NAME, BADGE_VARIANT } from "./consts";
import type { BadgeProps, BadgeVariant } from "./types";

function createBadge(variant: BadgeVariant) {
  return forwardRef<HTMLSpanElement, BadgeProps>(function ProteusBadge(
    { intent = BADGE_DEFAULT.intent, classNames, className, children, ...rest },
    ref,
  ) {
    return (
      <span
        ref={ref}
        className={cn(BADGE_CLASS.root, classNames?.root, className)}
        data-intent={intent}
        data-variant={variant}
        {...rest}
      >
        {children}
      </span>
    );
  });
}

export const Badge = createBadge(BADGE_VARIANT.Badge);
Badge.displayName = BADGE_DISPLAY_NAME.Badge;

export const Pill = createBadge(BADGE_VARIANT.Pill);
Pill.displayName = BADGE_DISPLAY_NAME.Pill;
