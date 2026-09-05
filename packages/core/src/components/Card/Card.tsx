import { createContext, forwardRef, useContext } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../../utils/cn";
import { asSlot, collectNamedSlots } from "../../utils/compound";
import { CARD_CLASS, CARD_DISPLAY_NAME } from "./consts";
import type { CardBodyProps, CardFooterProps, CardProps, CardSlot, CardTitleProps } from "./types";

const CardClassNamesContext = createContext<SlotClassNames<CardSlot> | undefined>(undefined);

export const CardTitle = asSlot(
  CARD_DISPLAY_NAME.Title,
  forwardRef<HTMLDivElement, CardTitleProps>(function CardTitle(
    { className, children, ...rest },
    ref,
  ) {
    const classNames = useContext(CardClassNamesContext);
    return (
      <div ref={ref} className={cn(CARD_CLASS.header, classNames?.header, className)} {...rest}>
        {children}
      </div>
    );
  }),
);

export const CardBody = asSlot(
  CARD_DISPLAY_NAME.Body,
  forwardRef<HTMLDivElement, CardBodyProps>(function CardBody(
    { className, children, ...rest },
    ref,
  ) {
    const classNames = useContext(CardClassNamesContext);
    return (
      <div ref={ref} className={cn(CARD_CLASS.body, classNames?.body, className)} {...rest}>
        {children}
      </div>
    );
  }),
);

export const CardFooter = asSlot(
  CARD_DISPLAY_NAME.Footer,
  forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
    { className, children, ...rest },
    ref,
  ) {
    const classNames = useContext(CardClassNamesContext);
    return (
      <div ref={ref} className={cn(CARD_CLASS.footer, classNames?.footer, className)} {...rest}>
        {children}
      </div>
    );
  }),
);

const CardRoot = forwardRef<HTMLElement, CardProps>(function Card(
  { classNames, className, children, ...rest },
  ref,
) {
  const slots = collectNamedSlots(
    children,
    { Title: CardTitle, Body: CardBody, Footer: CardFooter },
    CARD_DISPLAY_NAME.Root,
  );
  return (
    <CardClassNamesContext.Provider value={classNames}>
      <article ref={ref} className={cn(CARD_CLASS.root, classNames?.root, className)} {...rest}>
        {slots.Title}
        {slots.Body}
        {slots.Footer}
      </article>
    </CardClassNamesContext.Provider>
  );
});
CardRoot.displayName = CARD_DISPLAY_NAME.Root;

export const Card = Object.assign(CardRoot, {
  Title: CardTitle,
  Body: CardBody,
  Footer: CardFooter,
});
