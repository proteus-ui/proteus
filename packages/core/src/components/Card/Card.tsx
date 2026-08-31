import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { CARD_CLASS } from "./consts";
import type { CardProps } from "./types";

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { title, footer, classNames, className, children, ...rest },
  ref,
) {
  return (
    <article ref={ref} className={cn(CARD_CLASS.root, classNames?.root, className)} {...rest}>
      {title != null && <div className={cn(CARD_CLASS.header, classNames?.header)}>{title}</div>}
      <div className={cn(CARD_CLASS.body, classNames?.body)}>{children}</div>
      {footer != null && <div className={cn(CARD_CLASS.footer, classNames?.footer)}>{footer}</div>}
    </article>
  );
});
