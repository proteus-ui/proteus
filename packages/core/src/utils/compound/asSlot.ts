import type { ComponentType } from "react";
import type { SlotComponent } from "./types";

export function asSlot<Name extends string, P extends object>(
  name: Name,
  component: ComponentType<P>,
): SlotComponent<Name, P> {
  return Object.assign(component, { $$proteusSlot: name, displayName: name });
}
