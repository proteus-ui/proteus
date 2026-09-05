import type { ComponentType } from "react";

declare const PROTEUS_ELEMENT: unique symbol;

export type ProteusElement<Name extends string> = {
  readonly [PROTEUS_ELEMENT]: Name;
};

export type CompoundChild<Name extends string> =
  | ProteusElement<Name>
  | boolean
  | null
  | undefined;

export type CompoundChildren<Name extends string> =
  | CompoundChild<Name>
  | ReadonlyArray<CompoundChild<Name>>;

export type SlotComponent<Name extends string, P extends object> = ComponentType<P> & {
  displayName: Name;
  readonly $$proteusSlot: Name;
};
