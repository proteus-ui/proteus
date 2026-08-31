import { cloneElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement, ReactNode, Ref } from "react";
import { flip, offset, shift, useFloating, type Middleware } from "@floating-ui/react";
import { useTooltip, useTooltipTrigger } from "@react-aria/tooltip";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../utils/cn";

function skipWithoutLayout(middleware: Middleware): Middleware {
  return {
    ...middleware,
    async fn(state) {
      const { width, height } = state.rects.reference;
      if (width === 0 && height === 0) return {};
      return middleware.fn(state);
    },
  };
}

export type TooltipPlacement = "top" | "bottom" | "left" | "right";
export type TooltipSlot = "root";

export interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  placement?: TooltipPlacement;
  delay?: number;
  classNames?: SlotClassNames<"root">;
}

type TooltipTriggerState = {
  isOpen: boolean;
  shouldSkipAnimation: boolean;
  open: (immediate?: boolean) => void;
  close: (immediate?: boolean) => void;
};

function childTriggerRef(children: ReactElement): Ref<HTMLElement> | undefined {
  const propsRef = (children.props as { ref?: Ref<HTMLElement> }).ref;
  if (propsRef != null) return propsRef;
  return "ref" in children ? (children.ref as Ref<HTMLElement> | undefined) : undefined;
}

function mergeTriggerProps(
  childProps: Record<string, unknown>,
  triggerProps: Record<string, unknown>,
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...triggerProps };
  for (const [key, value] of Object.entries(triggerProps)) {
    if (key === "ref") continue;
    const existing = childProps[key];
    if (typeof existing === "function" && typeof value === "function") {
      merged[key] = (...args: unknown[]) => {
        (existing as (...a: unknown[]) => void)(...args);
        (value as (...a: unknown[]) => void)(...args);
      };
    }
  }
  return merged;
}

export function Tooltip({
  content,
  children,
  placement = "top",
  delay = 1500,
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
    () => [offset(8), skipWithoutLayout(flip()), skipWithoutLayout(shift())],
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
          className={cn("pr-tooltip", classNames?.root)}
          data-placement={resolvedPlacement}
        >
          {content}
        </div>
      ) : null}
    </>
  );
}
