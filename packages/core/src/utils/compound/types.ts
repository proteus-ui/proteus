import type { ComponentProps, ElementType, ReactElement } from "react";

export type SlotElement<C extends ElementType> = ReactElement<ComponentProps<C>, C>;

export type CompoundChild<E extends ReactElement> = E | boolean | null | undefined;

export type CompoundChildren<E extends ReactElement> =
  | CompoundChild<E>
  | Iterable<CompoundChild<E>>;
