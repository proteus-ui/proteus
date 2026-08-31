import { NAVIGATION_KEYS } from "../../utils/keyboard";
import type { NavigationKey, SelectOption } from "./types";

export function labelForId(id: string, options: readonly SelectOption[]): string {
  return options.find((option) => option.value === id)?.label ?? "";
}

export function optionHaystack(option: SelectOption): string {
  return option.label;
}

export function isNavigationKey(key: string): key is NavigationKey {
  return (NAVIGATION_KEYS as readonly string[]).includes(key);
}

export function formatOptionCount(count: number): string {
  return `${count} suggestion${count === 1 ? "" : "s"} available`;
}
