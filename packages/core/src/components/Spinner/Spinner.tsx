import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../../utils/cn";

export type SpinnerSize = "sm" | "md";
export type SpinnerSlot = "root";
export type PageLoaderSlot = "root";

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  label?: string;
  classNames?: SlotClassNames<SpinnerSlot>;
}

export interface PageLoaderProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  classNames?: SlotClassNames<PageLoaderSlot>;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size, label, classNames, className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn("pr-spinner", classNames?.root, className)}
      {...rest}
      role="status"
      aria-label={label ?? "Loading"}
      data-size={size}
    />
  );
});

export const PageLoader = forwardRef<HTMLDivElement, PageLoaderProps>(function PageLoader(
  { label, classNames, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn("pr-page-loader", classNames?.root, className)} {...rest}>
      <Spinner size="md" label={label} />
    </div>
  );
});
