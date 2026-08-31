export const KEYBOARD_KEYS = {
  ARROW_DOWN: "ArrowDown",
  ARROW_UP: "ArrowUp",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  ENTER: "Enter",
  ESCAPE: "Escape",
  TAB: "Tab",
  BACKSPACE: "Backspace",
  SPACE: " ",
  HOME: "Home",
  END: "End",
} as const;

export const NAVIGATION_KEYS = [
  KEYBOARD_KEYS.ARROW_DOWN,
  KEYBOARD_KEYS.ARROW_UP,
  KEYBOARD_KEYS.ENTER,
  KEYBOARD_KEYS.ESCAPE,
  KEYBOARD_KEYS.TAB,
] as const;
