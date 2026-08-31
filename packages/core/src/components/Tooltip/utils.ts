import type { ReactElement, Ref } from "react";
import type { Middleware } from "@floating-ui/react";

export function skipWithoutLayout(middleware: Middleware): Middleware {
  return {
    ...middleware,
    async fn(state) {
      const { width, height } = state.rects.reference;
      if (width === 0 && height === 0) return {};
      return middleware.fn(state);
    },
  };
}

export function childTriggerRef(children: ReactElement): Ref<HTMLElement> | undefined {
  const propsRef = (children.props as { ref?: Ref<HTMLElement> }).ref;
  if (propsRef != null) return propsRef;
  return "ref" in children ? (children.ref as Ref<HTMLElement> | undefined) : undefined;
}

export function mergeTriggerProps(
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
