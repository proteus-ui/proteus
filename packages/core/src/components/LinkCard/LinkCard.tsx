import { createContext, forwardRef, useContext } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../../utils/cn";
import { collectNamedSlots } from "../../utils/compound";
import { LINK_CARD_CLASS, LINK_CARD_DISPLAY_NAME } from "./consts";
import type { LinkCardBodyProps, LinkCardProps, LinkCardSlot, LinkCardTitleProps } from "./types";

const LinkCardClassNamesContext = createContext<SlotClassNames<LinkCardSlot> | undefined>(undefined);

export const LinkCardTitle = forwardRef<HTMLDivElement, LinkCardTitleProps>(function LinkCardTitle(
  { className, children, ...rest },
  ref,
) {
  const classNames = useContext(LinkCardClassNamesContext);
  return (
    <div ref={ref} className={cn(LINK_CARD_CLASS.title, classNames?.title, className)} {...rest}>
      {children}
    </div>
  );
});
LinkCardTitle.displayName = LINK_CARD_DISPLAY_NAME.Title;

export const LinkCardBody = forwardRef<HTMLDivElement, LinkCardBodyProps>(function LinkCardBody(
  { className, children, ...rest },
  ref,
) {
  const classNames = useContext(LinkCardClassNamesContext);
  return (
    <div ref={ref} className={cn(LINK_CARD_CLASS.body, classNames?.body, className)} {...rest}>
      {children}
    </div>
  );
});
LinkCardBody.displayName = LINK_CARD_DISPLAY_NAME.Body;

const LinkCardRoot = forwardRef<HTMLAnchorElement, LinkCardProps>(function LinkCard(
  { href, classNames, className, children, ...rest },
  ref,
) {
  const slots = collectNamedSlots(
    children,
    { Title: LinkCardTitle, Body: LinkCardBody },
    LINK_CARD_DISPLAY_NAME.Root,
  );
  return (
    <LinkCardClassNamesContext.Provider value={classNames}>
      <a
        ref={ref}
        className={cn(LINK_CARD_CLASS.root, classNames?.root, className)}
        {...rest}
        href={href}
      >
        {slots.Title}
        {slots.Body}
      </a>
    </LinkCardClassNamesContext.Provider>
  );
});
LinkCardRoot.displayName = LINK_CARD_DISPLAY_NAME.Root;

export const LinkCard = Object.assign(LinkCardRoot, {
  Title: LinkCardTitle,
  Body: LinkCardBody,
});
