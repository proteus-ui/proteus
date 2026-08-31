import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { PAGE_LOADER_CLASS, SPINNER_CLASS, SPINNER_DEFAULT } from "./consts";
import type { PageLoaderProps, SpinnerProps } from "./types";

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size, label, classNames, className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(SPINNER_CLASS.root, classNames?.root, className)}
      {...rest}
      role="status"
      aria-label={label ?? SPINNER_DEFAULT.label}
      data-size={size}
    />
  );
});

export const PageLoader = forwardRef<HTMLDivElement, PageLoaderProps>(function PageLoader(
  { label, classNames, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(PAGE_LOADER_CLASS.root, classNames?.root, className)} {...rest}>
      <Spinner size={SPINNER_DEFAULT.size} label={label} />
    </div>
  );
});
