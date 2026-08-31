# Proteus Storybook — Design Spec

- **Status:** Approved for planning
- **Date:** 2026-08-30
- **Repo:** `/Users/tomasz.morawski/proteus`
- **Depends on:** foundation packages `@proteus-ui/core`, `@proteus-ui/tokens`, `@proteus-ui/theme-default`

## Goal

Add a private Storybook app that renders every component shipped in the foundation slice, under the default theme, so appearance and behavior can be inspected without a throwaway consumer app.

## Non-goals

- Not a published npm package.
- No Chromatic, visual-regression CI, addon-a11y, MDX docs pages, or Storybook test-runner in this slice.
- No theme toolbar / `-like` themes. Those wait for later theme packages.
- No stories for `cn()` or hooks (`useControllableState`, `useCloseOnEscape`, `useCloseOnOutsideClick`, `useDialogTransition`).
- No changes to the public component APIs.

## Architecture

```
apps/storybook/                 private Vite + Storybook 9 app
  .storybook/main.ts            @storybook/react-vite, story glob
  .storybook/preview.ts         CSS import order + autodocs
  src/**/*.stories.tsx          one CSF file per exported component
packages/core                   workspace source (aliased)
packages/theme-default          static CSS
packages/tokens                 consumed via core; CSS imported in preview
```

Update `pnpm-workspace.yaml` to list both `packages/*` and `apps/*` (today it is only `packages/*`). `apps/storybook` is `private: true` and depends on `@proteus-ui/core`, `@proteus-ui/theme-default`, and `@proteus-ui/tokens` as `workspace:*` (tokens is required so `preview.ts` can import `@proteus-ui/tokens/tokens.css`). React/React DOM are regular app dependencies (not peers).

Vite aliases, most-specific first:

1. `@proteus-ui/core/styles.css` → `packages/core/src/styles.css`
2. `@proteus-ui/core` → `packages/core/src/index.ts`

A single alias of `@proteus-ui/core` to `index.ts` would break the `/styles.css` subpath. Theme and tokens CSS use each package's `exports` map (no alias). Stories import from `@proteus-ui/core` (the public barrel). Component TSX edits hot-reload without a core `tsup` rebuild.

## CSS load order

`preview.ts` imports, in this order (later sheets win). Core structural CSS is loaded **before** theme skins so `.pr-button { font: inherit }` cannot override theme `font-family` / `font-size`:

1. `@proteus-ui/tokens/tokens.css` — contract fallbacks
2. `@proteus-ui/theme-default/tokens.css` — author token values
3. `@proteus-ui/core/styles.css` — structural defaults
4. `@proteus-ui/theme-default/theme.css` — component skins

No runtime theme injection.

## Stories

CSF3, TypeScript, `autodocs` enabled. One file per export. Args/controls cover the public props below. Named variants are extra stories, not a replacement for controls.

| File | Export | Controls | Named stories |
|------|--------|----------|---------------|
| `Button.stories.tsx` | `Button` | `intent`, `size`, `disabled`, `children`, optional `icon` | Default, Primary, Danger, Disabled, WithIcon |
| `OutlineButton.stories.tsx` | `OutlineButton` | same as Button | Default, Primary |
| `IconButton.stories.tsx` | `IconButton` | `intent`, `size`, `disabled`, `icon` (no `children`) | Default, Disabled — both pass `aria-label` |
| `TextInput.stories.tsx` | `TextInput` | `defaultValue`, `invalid`, `disabled`, `placeholder` | Default, Invalid, Disabled |
| `SearchBar.stories.tsx` | `SearchBar` | `defaultValue`, `disabled`, `placeholder`; `onClear` as action | Default, WithValue, Disabled |
| `Dialog.stories.tsx` | `Dialog` | `open`, `title`, `children`; `onClose` as action | Closed, Open |

Dialog stays controlled: `open` is an arg. Overlay click and Escape call `onClose`. The Open story starts with `open: true`. Stories do not add an `onOpenChange` prop (the component has `onClose` only).

## Scripts

Root:

- `storybook` → `pnpm --filter @proteus-ui/storybook storybook`
- `build-storybook` → `pnpm --filter @proteus-ui/storybook build-storybook`

App (`@proteus-ui/storybook`):

- `storybook` — Storybook dev server, port **6006**
- `build-storybook` — static build

Library Vitest stays the only automated test suite. This slice does not add Storybook tests.

## Success criteria

- `pnpm storybook` serves all six component files with working controls and named variants.
- Default theme (pink/author tokens + skins) is visible without extra consumer CSS.
- Editing a file under `packages/core/src/components` hot-reloads the matching story.
- `pnpm test` (library suite) still passes. Storybook is not part of that suite.

## Out of scope follow-ups

Theme switcher, Chromatic, a11y addon, test-runner, stories for remaining primitives (Plan 2).
