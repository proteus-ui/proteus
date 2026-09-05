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

function typeName(type: unknown): string | undefined {
  if (type == null || (typeof type !== "function" && typeof type !== "object")) return undefined;
  const tagged = type as { $$proteusSlot?: string; displayName?: string };
  return tagged.$$proteusSlot ?? tagged.displayName;
}

function matchSlot<T extends Record<string, ElementType>>(
  childType: unknown,
  slots: T,
  typeToKey: Map<unknown, keyof T>,
): keyof T | undefined {
  const byRef = typeToKey.get(childType);
  if (byRef != null) return byRef;
  const name = typeName(childType);
  if (name == null) return undefined;
  for (const key of Object.keys(slots) as (keyof T)[]) {
    if (typeName(slots[key]) === name) return key;
  }
  return undefined;
}

export function collectNamedSlots<T extends Record<string, ElementType>>(
  children: unknown,
  slots: T,
  parentName: string,
): { [K in keyof T]?: ReactElement<ComponentProps<T[K]>, T[K]> } {
  const typeToKey = new Map<unknown, keyof T>();
  for (const key of Object.keys(slots) as (keyof T)[]) {
    typeToKey.set(slots[key], key);
  }
  const found: { [K in keyof T]?: ReactElement<ComponentProps<T[K]>, T[K]> } = {};
  Children.forEach(children as ReactNode, (child, index) => {
    if (child == null || typeof child === "boolean" || isBlankText(child)) return;
    if (!isValidElement(child)) {
      throw new Error(COMPOUND_ERROR.InvalidChild(parentName, slotList(slots), index));
    }
    const key = matchSlot(child.type, slots, typeToKey);
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
  children: unknown,
  slot: C,
  parentName: string,
  slotName: string,
): ReactElement<ComponentProps<C>, C>[] {
  const items: ReactElement<ComponentProps<C>, C>[] = [];
  const expectedName = typeName(slot);
  Children.forEach(children as ReactNode, (child, index) => {
    if (child == null || typeof child === "boolean" || isBlankText(child)) return;
    if (!isValidElement(child)) {
      throw new Error(COMPOUND_ERROR.InvalidChild(parentName, slotName, index));
    }
    const sameRef = child.type === slot;
    const sameName = expectedName != null && typeName(child.type) === expectedName;
    if (!sameRef && !sameName) {
      throw new Error(COMPOUND_ERROR.InvalidChild(parentName, slotName, index));
    }
    items.push(child as ReactElement<ComponentProps<C>, C>);
  });
  return items;
}
