import { forwardRef, useId } from "react";
import { cn } from "../../utils/cn";
import { SECTION_CLASS } from "./consts";
import type { SectionProps } from "./types";

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { title, classNames, className, children, "aria-labelledby": ariaLabelledby, ...rest },
  ref,
) {
  const titleId = useId();
  return (
    <section
      ref={ref}
      className={cn(SECTION_CLASS.root, classNames?.root, className)}
      {...rest}
      aria-labelledby={title != null ? titleId : ariaLabelledby}
    >
      {title != null && (
        <h2 id={titleId} className={cn(SECTION_CLASS.title, classNames?.title)}>
          {title}
        </h2>
      )}
      <div className={cn(SECTION_CLASS.body, classNames?.body)}>{children}</div>
    </section>
  );
});
