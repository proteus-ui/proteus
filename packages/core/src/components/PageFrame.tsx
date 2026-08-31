import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../utils/cn";

export type PageFrameSlot = "root" | "header" | "main" | "footer";

export interface PageFrameProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
  classNames?: SlotClassNames<PageFrameSlot>;
  children?: ReactNode;
}

export const PageFrame = forwardRef<HTMLDivElement, PageFrameProps>(function PageFrame(
  { header, footer, classNames, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn("pr-page-frame", classNames?.root, className)} {...rest}>
      {header != null && (
        <header className={cn("pr-page-frame__header", classNames?.header)}>{header}</header>
      )}
      <main className={cn("pr-page-frame__main", classNames?.main)}>{children}</main>
      {footer != null && (
        <footer className={cn("pr-page-frame__footer", classNames?.footer)}>{footer}</footer>
      )}
    </div>
  );
});
