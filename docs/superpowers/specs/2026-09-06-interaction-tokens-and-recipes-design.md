# Proteus — Interaction tokens and theme recipes

- **Status:** Draft for review
- **Date:** 2026-09-06
- **Parent spec:** [2026-08-29-proteus-component-library-design.md](./2026-08-29-proteus-component-library-design.md)
- **Repo:** `/Users/tomasz.morawski/proteus`

## Thesis

Hover, focus, disabled opacity, and control-transition motion are **shared appearance concerns**. They belong in `@proteus-ui/tokens` (values) and `@proteus-ui/theme-default` (recipes), not duplicated per component block and not as new core markup classes.

One semantic transition token lets consumers override all control hover/focus paint motion in a single CSS variable assignment.

## Goals

1. Stop copying field chrome, focus rings, and disabled opacity across TextInput, Textarea, SearchBar, Select, NumberStepper, and related controls.
2. Add SemVer-protected **interaction tokens** so themes and consumers share the same names.
3. Express shared rules once via **grouped selector recipes** in `theme.css` (extend the existing `.pr-input, .pr-search` pattern).
4. Ship one overridable `--pr-transition-control` applied to control-family roots; honor `prefers-reduced-motion`.
5. Keep core headless: no `.pr-field` / `.pr-pressable` classes, no React transition API.

## Non-goals

- No solid `Button` primary/danger darken-on-hover token in this pass (`--pr-color-action-primary-hover` deferred until the look is defined).
- No Material-like ripples, elevation lifts, or behavioral parity with incumbents.
- No SCSS/Less mixins; stay plain CSS (parent styling contract).
- No new core shell classes or compound “Control” React wrapper.
- No change to Dialog enter/exit transition or Spinner animation (component-specific motion stays local).
- No job-inbox migration in this work.
- No Playwright visual suite required for this pass.

## Decision

**Chosen:** theme-only recipes + interaction tokens (approach 1 from design review).

Rejected for now:

- **Opt-in shell class from core** — couples markup to appearance families; extra SemVer surface.
- **Local custom properties only** — still duplicates `:hover` / `:focus-within` rule blocks unless combined with recipes.

## Token contract (v1)

Add to `TOKEN_VARS`, contract `packages/tokens/src/tokens.css`, and seed values in `packages/theme-default/src/tokens.css`.

| Token | Role | theme-default seed |
| --- | --- | --- |
| `--pr-color-border-hover` | Field / control border on hover | Darker than `--pr-color-border` (e.g. one step toward text) |
| `--pr-color-surface-hover` | Soft fill on hover (text button, chrome) | Soft neutral; may use `color-mix` against border/text |
| `--pr-focus-ring-color` | Focus outline color | `var(--pr-color-action-primary)` |
| `--pr-focus-ring-width` | Focus outline width | `2px` |
| `--pr-focus-ring-offset` | Focus outline offset | `2px` |
| `--pr-opacity-disabled` | Disabled fade | `0.5` |
| `--pr-transition-control` | Shared paint transition for control families | See Motion |

Names stay intent-based and SemVer-protected. Renaming is breaking.

### Motion

Single shorthand token (not separate duration/easing tokens in v1):

```css
--pr-transition-control: border-color 150ms ease, background-color 150ms ease, color 150ms ease, opacity 150ms ease, box-shadow 150ms ease;
```

**Consumer override** (CSS variables are the API; no library method):

```css
:root {
  --pr-transition-control: none;
}
/* or scoped */
.dense-panel {
  --pr-transition-control: border-color 80ms linear;
}
```

**Reduced motion** in `theme-default`:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --pr-transition-control: none;
  }
}
```

Dialog / Spinner keep their own transition rules and are outside this token.

Optional later (not v1): `--pr-motion-duration-control` / `--pr-motion-easing-control` composed into the shorthand for `createTheme` emphasis inputs.

## Recipe families (`theme-default` / `theme.css`)

Place shared recipe blocks near the top of theme CSS (or a clearly marked “Interaction recipes” section). Component sections keep layout and unique deltas only.

### 1. Control transition

Apply to family roots that participate in hover/focus paint:

- Fields: `.pr-input`, `.pr-search`, `.pr-textarea`, `.pr-select`, `.pr-stepper`, `.pr-time`, `.pr-otp`
- Pressables: `.pr-button`, `.pr-toolbar__button`, `.pr-collapse__trigger`, `.pr-link-card`
- Chrome: `.pr-search__clear`, `.pr-select__clear`, `.pr-select__toggle`, `.pr-stepper__dec`, `.pr-stepper__inc`

```css
transition: var(--pr-transition-control);
```

When adding a new interactive control to the library, append its root (or chrome part) to this list.

### 2. Field shell

Shared base (dedupe today’s repeated border/radius/surface):

```css
.pr-input,
.pr-search,
.pr-textarea,
.pr-select,
.pr-stepper {
  border: 1px solid var(--pr-color-border);
  border-radius: var(--pr-radius-sm);
  background: var(--pr-color-surface);
}
```

Include `.pr-time` / `.pr-otp` in the same shell only if their current chrome matches; otherwise leave them on focus-ring + transition recipes only.

**Hover** (must not override invalid):

```css
.pr-input:hover:not([data-disabled]):not([data-invalid]),
.pr-search:hover:not([data-disabled]):not([data-invalid]),
.pr-textarea:hover:not([data-disabled]):not([data-invalid]),
.pr-select:hover:not([data-disabled]):not([data-invalid]),
.pr-stepper:hover:not([data-disabled]):not([data-invalid]) {
  border-color: var(--pr-color-border-hover);
}
```

Invalid rules stay per existing `[data-invalid]` border → `--pr-color-feedback-error`.

### 3. Focus ring

Replace duplicated `outline: 2px solid var(--pr-color-action-primary)` blocks with:

```css
outline: var(--pr-focus-ring-width) solid var(--pr-focus-ring-color);
outline-offset: var(--pr-focus-ring-offset);
```

Targets: field `:focus-within` group, plus existing `:focus-visible` on button, checkbox input, collapse trigger, toolbar button, link-card, time field, otp cell, etc. Prefer one or two grouped selectors; keep `:focus-within` vs `:focus-visible` distinction as today.

### 4. Pressable chrome

Cursor `pointer` on clear/toggle/stepper chrome (and any other icon affordances that already use it). Optional hover fill:

```css
background: var(--pr-color-surface-hover);
```

where a soft fill is appropriate (not on every chrome control if it fights layout).

### 5. Disabled

Replace hard-coded `opacity: 0.5` with `opacity: var(--pr-opacity-disabled)` on existing disabled selectors. Interactive disabled controls: `cursor: not-allowed` where not already set in core (Button remains in core `styles.css`).

### Stays per-component

- Button variant fills and intent-specific text-variant hover (`color-mix` against action/error; may reference `--pr-color-surface-hover` for neutral text variant).
- Select option `[data-highlighted]`, Toolbar `[data-pressed]`.
- Dialog overlay/panel motion, Spinner keyframes.
- Layout-only rules (padding, flex, widths).

## Core package

No API changes. No new slots. Cursor defaults on `.pr-button` / `[data-disabled]` may remain in `packages/core/src/styles.css` as structural UX.

## Testing

- `@proteus-ui/tokens`: `TOKEN_VARS` / contract CSS include every new token name.
- `@proteus-ui/theme-default`: theme CSS contains recipe family selectors, `var(--pr-transition-control)`, focus-ring vars, and `prefers-reduced-motion` override of `--pr-transition-control`.
- No new RTL behavior tests required (appearance-only). Existing Button `data-variant="text"` tests stay as-is.

## Rollout

1. Extend token contract + theme seed values.
2. Add recipe section; delete duplicated field/focus/disabled declarations from component blocks.
3. Point text-button / chrome soft fills at `--pr-color-surface-hover` where it replaces ad-hoc mixes without changing intended look.
4. Verify Storybook: inputs, textarea, select, stepper, buttons (incl. text), reduced-motion.

## Future hooks

- `createTheme` `emphasis` may later drive hover deltas and `--pr-transition-control` duration.
- Solid button hover tokens when primary/danger hover look is specified.
- Revisit a core shell class only if family selector lists become error-prone.
