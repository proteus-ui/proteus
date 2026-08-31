import type { KEYBOARD_KEYS, NAVIGATION_KEYS } from "./consts";

export type KeyboardKey = (typeof KEYBOARD_KEYS)[keyof typeof KEYBOARD_KEYS];
export type NavigationKey = (typeof NAVIGATION_KEYS)[number];
