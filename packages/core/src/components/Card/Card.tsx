import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../../utils/cn";

export type CardSlot = "root" | "header" | "body" | "footer";

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  footer?: ReactNode;
  classNames?: SlotClassNames<CardSlot>;
  children?: ReactNode;
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { title, footer, classNames, className, children, ...rest },
  ref,
) {
  return (
    <article ref={ref} className={cn("pr-card", classNames?.root, className)} {...rest}>
      {title != null && <div className={cn("pr-card__header", classNames?.header)}>{title}</div>}
      <div className={cn("pr-card__body", classNames?.body)}>{children}</div>
      {footer != null && <div className={cn("pr-card__footer", classNames?.footer)}>{footer}</div>}
    </article>
  );
});
