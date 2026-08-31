import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { PAGE_FRAME_CLASS } from "./consts";
import type { PageFrameProps } from "./types";

export const PageFrame = forwardRef<HTMLDivElement, PageFrameProps>(function PageFrame(
  { header, footer, classNames, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(PAGE_FRAME_CLASS.root, classNames?.root, className)} {...rest}>
      {header != null && (
        <header className={cn(PAGE_FRAME_CLASS.header, classNames?.header)}>{header}</header>
      )}
      <main className={cn(PAGE_FRAME_CLASS.main, classNames?.main)}>{children}</main>
      {footer != null && (
        <footer className={cn(PAGE_FRAME_CLASS.footer, classNames?.footer)}>{footer}</footer>
      )}
    </div>
  );
});
