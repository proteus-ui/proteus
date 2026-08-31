import { forwardRef, useId } from "react";
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
  const text = label ?? SPINNER_DEFAULT.label;
  const labelId = useId();
  return (
    <div
      ref={ref}
      className={cn(PAGE_LOADER_CLASS.root, classNames?.root, className)}
      {...rest}
      role="status"
      aria-labelledby={labelId}
    >
      <Spinner size={SPINNER_DEFAULT.size} aria-hidden="true" />
      <span id={labelId} className={cn(PAGE_LOADER_CLASS.label, classNames?.label)}>
        {text}
      </span>
    </div>
  );
});
