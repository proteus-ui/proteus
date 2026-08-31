import { cloneElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flip, offset, shift, useFloating } from "@floating-ui/react";
import { useTooltip, useTooltipTrigger } from "@react-aria/tooltip";
import { cn } from "../../utils/cn";
import { TOOLTIP_CLASS, TOOLTIP_DEFAULT } from "./consts";
import type { TooltipProps, TooltipTriggerState } from "./types";
import { childTriggerRef, mergeTriggerProps, skipWithoutLayout } from "./utils";

export function Tooltip({
  content,
  children,
  placement = TOOLTIP_DEFAULT.placement,
  delay = TOOLTIP_DEFAULT.delay,
  classNames,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const delayTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const open = useCallback(
    (immediate?: boolean) => {
      if (delayTimer.current !== undefined) {
        clearTimeout(delayTimer.current);
        delayTimer.current = undefined;
      }
      if (immediate || delay <= 0) {
        setIsOpen(true);
        return;
      }
      delayTimer.current = setTimeout(() => {
        delayTimer.current = undefined;
        setIsOpen(true);
      }, delay);
    },
    [delay],
  );

  const close = useCallback(() => {
    if (delayTimer.current !== undefined) {
      clearTimeout(delayTimer.current);
      delayTimer.current = undefined;
    }
    setIsOpen(false);
  }, []);

  useEffect(
    () => () => {
      if (delayTimer.current !== undefined) {
        clearTimeout(delayTimer.current);
        delayTimer.current = undefined;
      }
    },
    [],
  );

  const state = useMemo<TooltipTriggerState>(
    () => ({
      isOpen,
      shouldSkipAnimation: false,
      open,
      close,
    }),
    [isOpen, open, close],
  );

  const triggerRef = useRef<HTMLElement | null>(null);
  const middleware = useMemo(
    () => [offset(TOOLTIP_DEFAULT.offset), skipWithoutLayout(flip()), skipWithoutLayout(shift())],
    [],
  );
  const { refs, floatingStyles, placement: resolvedPlacement } = useFloating({
    open: isOpen,
    placement,
    middleware,
  });

  const { triggerProps, tooltipProps: triggerTooltipProps } = useTooltipTrigger(
    { delay },
    state,
    triggerRef,
  );
  const { tooltipProps } = useTooltip(triggerTooltipProps, state);

  const childRef = childTriggerRef(children);
  const setTriggerRef = useCallback(
    (node: HTMLElement | null) => {
      triggerRef.current = node;
      refs.setReference(node);
      if (typeof childRef === "function") childRef(node);
      else if (childRef) childRef.current = node;
    },
    [refs.setReference, childRef],
  );
  const trigger = cloneElement(
    children,
    mergeTriggerProps(children.props as Record<string, unknown>, {
      ...triggerProps,
      ref: setTriggerRef,
    }) as Partial<typeof children.props>,
  );

  return (
    <>
      {trigger}
      {isOpen ? (
        <div
          {...tooltipProps}
          ref={refs.setFloating}
          style={floatingStyles}
          className={cn(TOOLTIP_CLASS.root, classNames?.root)}
          data-placement={resolvedPlacement}
        >
          {content}
        </div>
      ) : null}
    </>
  );
}
