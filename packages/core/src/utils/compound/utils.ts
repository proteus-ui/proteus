import {
  Children,
  isValidElement,
  type ComponentProps,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";
import { COMPOUND_ERROR } from "./consts";

function isBlankText(child: ReactNode): boolean {
  return typeof child === "string" && child.trim() === "";
}

function slotList(slots: Record<string, unknown>): string {
  return Object.keys(slots).join(", ");
}

export function collectNamedSlots<T extends Record<string, ElementType>>(
  children: ReactNode,
  slots: T,
  parentName: string,
): { [K in keyof T]?: ReactElement<ComponentProps<T[K]>, T[K]> } {
  const typeToKey = new Map<unknown, keyof T>();
  for (const key of Object.keys(slots) as (keyof T)[]) {
    typeToKey.set(slots[key], key);
  }
  const found: { [K in keyof T]?: ReactElement<ComponentProps<T[K]>, T[K]> } = {};
  Children.forEach(children, (child, index) => {
    if (child == null || typeof child === "boolean" || isBlankText(child)) return;
    if (!isValidElement(child)) {
      throw new Error(COMPOUND_ERROR.InvalidChild(parentName, slotList(slots), index));
    }
    const key = typeToKey.get(child.type);
    if (key == null) {
      throw new Error(COMPOUND_ERROR.InvalidChild(parentName, slotList(slots), index));
    }
    if (found[key] != null) {
      throw new Error(COMPOUND_ERROR.DuplicateSlot(parentName, String(key)));
    }
    found[key] = child as ReactElement<ComponentProps<T[typeof key]>, T[typeof key]>;
  });
  return found;
}

export function collectRepeatingSlot<C extends ElementType>(
  children: ReactNode,
  slot: C,
  parentName: string,
  slotName: string,
): ReactElement<ComponentProps<C>, C>[] {
  const items: ReactElement<ComponentProps<C>, C>[] = [];
  Children.forEach(children, (child, index) => {
    if (child == null || typeof child === "boolean" || isBlankText(child)) return;
    if (!isValidElement(child) || child.type !== slot) {
      throw new Error(COMPOUND_ERROR.InvalidChild(parentName, slotName, index));
    }
    items.push(child as ReactElement<ComponentProps<C>, C>);
  });
  return items;
}
