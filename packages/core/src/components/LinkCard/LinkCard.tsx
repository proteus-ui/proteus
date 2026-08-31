import { forwardRef } from "react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../../utils/cn";

export type LinkCardSlot = "root" | "title" | "body";

export interface LinkCardProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "title"> {
  href: string;
  title?: ReactNode;
  classNames?: SlotClassNames<LinkCardSlot>;
  children?: ReactNode;
}

export const LinkCard = forwardRef<HTMLAnchorElement, LinkCardProps>(function LinkCard(
  { href, title, classNames, className, children, ...rest },
  ref,
) {
  return (
    <a
      ref={ref}
      className={cn("pr-link-card", classNames?.root, className)}
      {...rest}
      href={href}
    >
      {title != null && <div className={cn("pr-link-card__title", classNames?.title)}>{title}</div>}
      <div className={cn("pr-link-card__body", classNames?.body)}>{children}</div>
    </a>
  );
});
