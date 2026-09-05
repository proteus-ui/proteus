import type { Properties as CSSProperties } from "csstype";

/** Per-slot class-name override map. Keys are a component's named parts. */
export type SlotClassNames<Slot extends string> = Partial<Record<Slot, string>>;

/**
 * Per-slot inline-style escape hatch for runtime-dynamic geometry only.
 * Uses `csstype` (not React's `CSSProperties`) so the contract stays
 * framework-agnostic — no React dependency leaks into the token layer.
 */
export type SlotStyles<Slot extends string> = Partial<Record<Slot, CSSProperties>>;

/**
 * Canonical CSS-variable token names. This list is SemVer-protected public
 * surface: themes set these, components consume them. Renaming is breaking.
 * Names are intent-based (semantic), not appearance-based: components survive
 * a re-theme because they reference meaning (`action-primary`), never a hue.
 */
export const TOKEN_VARS = [
  "--pr-color-surface",
  "--pr-color-text",
  "--pr-color-text-muted",
  "--pr-color-border",
  "--pr-color-action-primary",
  "--pr-color-on-action-primary",
  "--pr-color-feedback-error",
  "--pr-color-on-feedback-error",
  "--pr-radius-sm",
  "--pr-radius-md",
  "--pr-space-1",
  "--pr-space-2",
  "--pr-space-3",
  "--pr-font-sans",
  "--pr-font-size-sm",
  "--pr-font-size-md",
  "--pr-font-size-lg",
  "--pr-font-size-xl",
  "--pr-font-size-2xl",
  "--pr-font-weight-semibold",
  "--pr-font-mono",
] as const;

export type TokenVar = (typeof TOKEN_VARS)[number];
