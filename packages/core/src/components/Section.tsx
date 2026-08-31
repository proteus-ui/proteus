import { forwardRef, useId } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../utils/cn";

export type SectionSlot = "root" | "title" | "body";

export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  classNames?: SlotClassNames<SectionSlot>;
  children?: ReactNode;
}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { title, classNames, className, children, "aria-labelledby": ariaLabelledby, ...rest },
  ref,
) {
  const titleId = useId();
  return (
    <section
      ref={ref}
      className={cn("pr-section", classNames?.root, className)}
      {...rest}
      aria-labelledby={title != null ? titleId : ariaLabelledby}
    >
      {title != null && (
        <h2 id={titleId} className={cn("pr-section__title", classNames?.title)}>
          {title}
        </h2>
      )}
      <div className={cn("pr-section__body", classNames?.body)}>{children}</div>
    </section>
  );
});
