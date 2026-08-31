import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { LINK_CARD_CLASS } from "./consts";
import type { LinkCardProps } from "./types";

export const LinkCard = forwardRef<HTMLAnchorElement, LinkCardProps>(function LinkCard(
  { href, title, classNames, className, children, ...rest },
  ref,
) {
  return (
    <a
      ref={ref}
      className={cn(LINK_CARD_CLASS.root, classNames?.root, className)}
      {...rest}
      href={href}
    >
      {title != null && <div className={cn(LINK_CARD_CLASS.title, classNames?.title)}>{title}</div>}
      <div className={cn(LINK_CARD_CLASS.body, classNames?.body)}>{children}</div>
    </a>
  );
});
