import { createContext, forwardRef, useContext, useId } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../../utils/cn";
import { asSlot, collectNamedSlots } from "../../utils/compound";
import { SECTION_CLASS, SECTION_DISPLAY_NAME } from "./consts";
import type { SectionBodyProps, SectionProps, SectionSlot, SectionTitleProps } from "./types";

type SectionContextValue = {
  titleId: string;
  classNames?: SlotClassNames<SectionSlot>;
};

const SectionContext = createContext<SectionContextValue | undefined>(undefined);

export const SectionTitle = asSlot(
  SECTION_DISPLAY_NAME.Title,
  forwardRef<HTMLHeadingElement, SectionTitleProps>(function SectionTitle(
    { className, children, ...rest },
    ref,
  ) {
    const ctx = useContext(SectionContext);
    return (
      <h2
        ref={ref}
        id={ctx?.titleId}
        className={cn(SECTION_CLASS.title, ctx?.classNames?.title, className)}
        {...rest}
      >
        {children}
      </h2>
    );
  }),
);

export const SectionBody = asSlot(
  SECTION_DISPLAY_NAME.Body,
  forwardRef<HTMLDivElement, SectionBodyProps>(function SectionBody(
    { className, children, ...rest },
    ref,
  ) {
    const ctx = useContext(SectionContext);
    return (
      <div ref={ref} className={cn(SECTION_CLASS.body, ctx?.classNames?.body, className)} {...rest}>
        {children}
      </div>
    );
  }),
);

const SectionRoot = forwardRef<HTMLElement, SectionProps>(function Section(
  { classNames, className, children, "aria-labelledby": ariaLabelledby, ...rest },
  ref,
) {
  const titleId = useId();
  const slots = collectNamedSlots(
    children,
    { Title: SectionTitle, Body: SectionBody },
    SECTION_DISPLAY_NAME.Root,
  );
  return (
    <SectionContext.Provider value={{ titleId, classNames }}>
      <section
        ref={ref}
        className={cn(SECTION_CLASS.root, classNames?.root, className)}
        {...rest}
        aria-labelledby={slots.Title != null ? titleId : ariaLabelledby}
      >
        {slots.Title}
        {slots.Body}
      </section>
    </SectionContext.Provider>
  );
});
SectionRoot.displayName = SECTION_DISPLAY_NAME.Root;

export const Section = Object.assign(SectionRoot, {
  Title: SectionTitle,
  Body: SectionBody,
});
