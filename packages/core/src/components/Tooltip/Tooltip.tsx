import { cloneElement, isValidElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flip, offset, shift, useFloating } from "@floating-ui/react";
import { useTooltip, useTooltipTrigger } from "@react-aria/tooltip";
import { cn } from "../../utils/cn";
import { collectNamedSlots } from "../../utils/compound";
import { TOOLTIP_CLASS, TOOLTIP_DEFAULT, TOOLTIP_DISPLAY_NAME } from "./consts";
import type { TooltipContentProps, TooltipProps, TooltipTriggerProps, TooltipTriggerState } from "./types";
import { childTriggerRef, mergeTriggerProps, skipWithoutLayout } from "./utils";

export function TooltipTrigger(_props: TooltipTriggerProps) {
  return null;
}
TooltipTrigger.displayName = TOOLTIP_DISPLAY_NAME.Trigger;

export function TooltipContent(_props: TooltipContentProps) {
  return null;
}
TooltipContent.displayName = TOOLTIP_DISPLAY_NAME.Content;

export function Tooltip({
  children,
  placement = TOOLTIP_DEFAULT.placement,
  delay = TOOLTIP_DEFAULT.delay,
  classNames,
}: TooltipProps) {
  const slots = collectNamedSlots(
    children,
    { Trigger: TooltipTrigger, Content: TooltipContent },
    TOOLTIP_DISPLAY_NAME.Root,
  );
  const triggerChild = slots.Trigger?.props.children;
  const content = slots.Content?.props.children;
  const contentClassName = slots.Content?.props.className;

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

  const childRef = isValidElement(triggerChild) ? childTriggerRef(triggerChild) : undefined;
  const setTriggerRef = useCallback(
    (node: HTMLElement | null) => {
      triggerRef.current = node;
      refs.setReference(node);
      if (typeof childRef === "function") childRef(node);
      else if (childRef) childRef.current = node;
    },
    [refs.setReference, childRef],
  );
  const trigger =
    isValidElement(triggerChild) ?
      cloneElement(
        triggerChild,
        mergeTriggerProps(triggerChild.props as Record<string, unknown>, {
          ...triggerProps,
          ref: setTriggerRef,
        }) as Partial<typeof triggerChild.props>,
      )
    : null;

  return (
    <>
      {trigger}
      {isOpen && content != null ? (
        <div
          {...tooltipProps}
          ref={refs.setFloating}
          style={floatingStyles}
          className={cn(TOOLTIP_CLASS.root, classNames?.root, contentClassName)}
          data-placement={resolvedPlacement}
        >
          {content}
        </div>
      ) : null}
    </>
  );
}

Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;
Tooltip.displayName = TOOLTIP_DISPLAY_NAME.Root;
