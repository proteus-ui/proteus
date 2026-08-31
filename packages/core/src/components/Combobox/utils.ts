import { NAVIGATION_KEYS } from "../../utils/keyboard";
import type { NavigationKey } from "./types";

export function isNavigationKey(key: string): key is NavigationKey {
  return (NAVIGATION_KEYS as readonly string[]).includes(key);
}

export function formatSuggestionCount(count: number): string {
  return `${count} suggestion${count === 1 ? "" : "s"} available`;
}
