# Interaction Tokens and Theme Recipes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Add SemVer-protected interaction tokens and shared theme CSS recipes for control hover, focus rings, disabled opacity, and one overridable `--pr-transition-control`.

**Architecture:** Values live in `@proteus-ui/tokens` + theme seed CSS. Rules live as grouped selector recipes at the top of `packages/theme-default/src/theme.css`. No new core classes or React APIs. Select/Time keep border on inner fields via existing local vars; hover updates those vars instead of root `border-color`.

**Tech Stack:** TypeScript, Vitest, plain CSS, pnpm workspace (`@proteus-ui/tokens`, `@proteus-ui/theme-default`).

**Spec:** [docs/superpowers/specs/2026-09-06-interaction-tokens-and-recipes-design.md](../specs/2026-09-06-interaction-tokens-and-recipes-design.md)

**Model phases (model-tiering):**

| Phase | Tasks | Tier | Model |
| --- | --- | --- | --- |
| A | 1–3 | T0 | Composer 2.5 |
| B (optional review) | after green | T2 | Opus 4.8 Medium — only if operator asks |

## Global Constraints

- Plain CSS only: low-specificity single-class + `data-*`. No `!important`. No nesting of `.pr-*` descendants for recipes (grouped comma selectors OK).
- No `.pr-field` / `.pr-pressable` in core. No React transition API.
- No solid Button primary/danger darken-on-hover token this pass.
- Do not alter Dialog enter/exit or Spinner `@keyframes` / reduced-motion spinner rules beyond leaving them alone.
- Do not commit unless the operator asks.
- Never run the full test suite unless the operator asks; run only the targeted vitest commands in each step.

---

## File map

| File | Responsibility |
| --- | --- |
| `packages/tokens/src/index.ts` | Append new names to `TOKEN_VARS` |
| `packages/tokens/src/tokens.css` | Contract default values for new tokens |
| `packages/tokens/src/index.test.ts` | Assert new token names present |
| `packages/theme-default/src/tokens.css` | theme-default seed values |
| `packages/theme-default/src/theme.css` | Interaction recipe section + dedupe component blocks |
| `packages/theme-default/src/theme.test.ts` | Assert recipes / vars / reduced-motion |

No Storybook file required (appearance-only; optional smoke in existing Button/Input stories is enough if already covering controls).

---

### Task 1: Failing contract tests (T0)

**Files:**
- Modify: `packages/tokens/src/index.test.ts`
- Modify: `packages/theme-default/src/theme.test.ts`

**Interfaces:**
- Consumes: existing Vitest patterns in those files
- Produces: red tests for seven new token names and theme recipe markers

- [x] **Step 1: Extend token test**

In `packages/tokens/src/index.test.ts`, inside `"exposes canonical token variable names"`, add:

```ts
expect(TOKEN_VARS).toContain("--pr-color-border-hover");
expect(TOKEN_VARS).toContain("--pr-color-surface-hover");
expect(TOKEN_VARS).toContain("--pr-focus-ring-color");
expect(TOKEN_VARS).toContain("--pr-focus-ring-width");
expect(TOKEN_VARS).toContain("--pr-focus-ring-offset");
expect(TOKEN_VARS).toContain("--pr-opacity-disabled");
expect(TOKEN_VARS).toContain("--pr-transition-control");
```

- [x] **Step 2: Extend theme test**

In `packages/theme-default/src/theme.test.ts`, inside the theme.css test, after the `.pr-button` assertions, add:

```ts
expect(css).toContain("--pr-transition-control");
expect(css).toContain("var(--pr-transition-control)");
expect(css).toContain("var(--pr-color-border-hover)");
expect(css).toContain("var(--pr-focus-ring-color)");
expect(css).toContain("var(--pr-opacity-disabled)");
expect(css).toMatch(/prefers-reduced-motion:\s*reduce/);
expect(css).toMatch(
  /\.pr-input,\s*\n\.pr-search,\s*\n\.pr-textarea,\s*\n\.pr-stepper/,
);
```

Also assert contract tokens file assigns the new vars (in the first test that reads `./tokens.css`):

```ts
expect(css).toMatch(/--pr-color-border-hover:\s*[^;]+;/);
expect(css).toMatch(/--pr-transition-control:\s*[^;]+;/);
expect(css).toMatch(/--pr-focus-ring-width:\s*[^;]+;/);
```

Note: `theme.test.ts` first test already reads `./tokens.css` (theme-default seeds). Those three `toMatch` lines go there. The `theme.css` assertions go in the second test.

- [x] **Step 3: Run tests — expect FAIL**

Run:

```bash
pnpm exec vitest run packages/tokens/src/index.test.ts packages/theme-default/src/theme.test.ts
```

Expected: FAIL — missing `TOKEN_VARS` entries and/or missing CSS strings.

---

### Task 2: Token contract + theme seeds (T0)

**Files:**
- Modify: `packages/tokens/src/index.ts`
- Modify: `packages/tokens/src/tokens.css`
- Modify: `packages/theme-default/src/tokens.css`

**Interfaces:**
- Produces exact token names (SemVer):

| Name | Contract default (`packages/tokens/src/tokens.css`) | theme-default seed |
| --- | --- | --- |
| `--pr-color-border-hover` | `#a1a1aa` | `#d1d5db` (darker than theme `#e5e7eb`) |
| `--pr-color-surface-hover` | `color-mix(in srgb, #d4d4d8 40%, transparent)` | `color-mix(in srgb, var(--pr-color-border) 40%, transparent)` |
| `--pr-focus-ring-color` | `var(--pr-color-action-primary)` | `var(--pr-color-action-primary)` |
| `--pr-focus-ring-width` | `2px` | `2px` |
| `--pr-focus-ring-offset` | `2px` | `2px` |
| `--pr-opacity-disabled` | `0.5` | `0.5` |
| `--pr-transition-control` | see below | same |

Transition value (both files):

```css
--pr-transition-control: border-color 150ms ease, background-color 150ms ease, color 150ms ease, opacity 150ms ease, box-shadow 150ms ease;
```

- [x] **Step 4: Append to `TOKEN_VARS` in `packages/tokens/src/index.ts`**

After `"--pr-font-mono",` add:

```ts
  "--pr-color-border-hover",
  "--pr-color-surface-hover",
  "--pr-focus-ring-color",
  "--pr-focus-ring-width",
  "--pr-focus-ring-offset",
  "--pr-opacity-disabled",
  "--pr-transition-control",
```

- [x] **Step 5: Write values into both `tokens.css` files**

`packages/tokens/src/tokens.css` — append inside `:root { ... }`:

```css
  --pr-color-border-hover: #a1a1aa;
  --pr-color-surface-hover: color-mix(in srgb, #d4d4d8 40%, transparent);
  --pr-focus-ring-color: var(--pr-color-action-primary);
  --pr-focus-ring-width: 2px;
  --pr-focus-ring-offset: 2px;
  --pr-opacity-disabled: 0.5;
  --pr-transition-control: border-color 150ms ease, background-color 150ms ease, color 150ms ease, opacity 150ms ease, box-shadow 150ms ease;
```

`packages/theme-default/src/tokens.css` — append inside `:root { ... }`:

```css
  --pr-color-border-hover: #d1d5db;
  --pr-color-surface-hover: color-mix(in srgb, var(--pr-color-border) 40%, transparent);
  --pr-focus-ring-color: var(--pr-color-action-primary);
  --pr-focus-ring-width: 2px;
  --pr-focus-ring-offset: 2px;
  --pr-opacity-disabled: 0.5;
  --pr-transition-control: border-color 150ms ease, background-color 150ms ease, color 150ms ease, opacity 150ms ease, box-shadow 150ms ease;
```

- [x] **Step 6: Re-run token test — expect PASS for tokens; theme may still FAIL**

Run:

```bash
pnpm exec vitest run packages/tokens/src/index.test.ts
```

Expected: PASS.

Theme test may still fail until Task 3 (missing recipe strings in `theme.css`). That is OK.

---

### Task 3: Theme recipes + dedupe (T0)

**Files:**
- Modify: `packages/theme-default/src/theme.css`

**Interfaces:**
- Produces recipe section consumed by all interactive controls listed below
- Does not change core markup

- [x] **Step 7: Insert interaction recipe block at the top of `theme.css` (before `.pr-button`)**

Exact block to insert:

```css
/* --- Interaction recipes (shared hover / focus / transition / disabled) --- */

.pr-input,
.pr-search,
.pr-textarea,
.pr-stepper,
.pr-select,
.pr-time,
.pr-otp,
.pr-button,
.pr-toolbar__button,
.pr-collapse__trigger,
.pr-link-card,
.pr-search__clear,
.pr-select__clear,
.pr-select__toggle,
.pr-stepper__dec,
.pr-stepper__inc {
  transition: var(--pr-transition-control);
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --pr-transition-control: none;
  }
}

.pr-input,
.pr-search,
.pr-textarea,
.pr-stepper {
  border: 1px solid var(--pr-color-border);
  border-radius: var(--pr-radius-sm);
  background: var(--pr-color-surface);
}

.pr-input:hover:not([data-disabled]):not([data-invalid]),
.pr-search:hover:not([data-disabled]):not([data-invalid]),
.pr-textarea:hover:not([data-disabled]):not([data-invalid]),
.pr-stepper:hover:not([data-disabled]):not([data-invalid]) {
  border-color: var(--pr-color-border-hover);
}

.pr-select:hover:not([data-disabled]):not([data-invalid]) {
  --pr-select-border: var(--pr-color-border-hover);
}

.pr-time:hover:not([data-disabled]):not([data-invalid]) {
  --pr-time-border: var(--pr-color-border-hover);
}

.pr-input:focus-within,
.pr-search:focus-within,
.pr-textarea:focus-within,
.pr-select:focus-within,
.pr-stepper:focus-within {
  outline: var(--pr-focus-ring-width) solid var(--pr-focus-ring-color);
  outline-offset: var(--pr-focus-ring-offset);
}

.pr-button:focus-visible,
.pr-checkbox__input:focus-visible,
.pr-collapse__trigger:focus-visible,
.pr-toolbar__button:focus-visible,
.pr-link-card:focus-visible,
.pr-time__field:focus-visible,
.pr-otp__cell:focus-visible,
.pr-select[data-state="open"] {
  outline: var(--pr-focus-ring-width) solid var(--pr-focus-ring-color);
  outline-offset: var(--pr-focus-ring-offset);
}

.pr-search__clear:hover:not(:disabled),
.pr-select__clear:hover:not(:disabled),
.pr-select__toggle:hover:not(:disabled),
.pr-stepper__dec:hover:not(:disabled),
.pr-stepper__inc:hover:not(:disabled) {
  background: var(--pr-color-surface-hover);
}

.pr-button[data-disabled],
.pr-checkbox[data-disabled],
.pr-toolbar__button[data-disabled],
.pr-select[data-disabled],
.pr-stepper[data-disabled],
.pr-time[data-disabled],
.pr-otp[data-disabled] {
  opacity: var(--pr-opacity-disabled);
}
```

- [x] **Step 8: Dedupe component blocks**

Remove now-redundant declarations from later sections. Keep layout/unique rules.

**`.pr-button` block:**
- Delete standalone `.pr-button[data-disabled] { opacity: 0.5; }` (covered by recipe).
- Delete `.pr-button:focus-visible { outline: …; outline-offset: …; }` (covered by recipe).
- Change neutral text-variant hover to use surface-hover token:

```css
.pr-button[data-variant="text"]:hover:not([data-disabled]) {
  background: var(--pr-color-surface-hover);
}
```

Keep primary/danger text-variant `color-mix` rules as-is (intent-specific).

**`.pr-input, .pr-search` block:**
- Remove `border`, `border-radius`, `background` from the shared rule (recipe owns them). Keep `display`, `align-items`.
- Delete `.pr-input:focus-within, .pr-search:focus-within { … }` (recipe owns it).

**`.pr-textarea` block:**
- Remove `border`, `border-radius`, `background` from base rule; keep `display: inline-flex`.
- Delete `.pr-textarea:focus-within { … }`.

**`.pr-checkbox`:**
- Delete `.pr-checkbox[data-disabled] { opacity: 0.5; }`.
- Delete `.pr-checkbox__input:focus-visible { … }`.

**`.pr-link-card`:**
- Delete `.pr-link-card:focus-visible { … }`.

**`.pr-collapse__trigger`:**
- Delete `.pr-collapse__trigger:focus-visible { … }`.

**`.pr-toolbar__button`:**
- Delete `[data-disabled] { opacity: 0.5; }` and `:focus-visible { … }`.

**`.pr-select`:**
- Delete `[data-disabled] { opacity: 0.5; }`.
- Delete `[data-state="open"]` outline pair and `:focus-within` outline pair (recipe covers both; keep `[data-state="open"]` only if it had non-outline rules — today it only sets outline, so delete the whole rule).
- Do **not** put root border on `.pr-select` (border stays on `.pr-select__field` via `--pr-select-border`).

**`.pr-stepper`:**
- Remove `border`, `border-radius`, `background` from base (recipe).
- Delete `[data-disabled] { opacity: 0.5; }` and `:focus-within { … }`.

**`.pr-time` / `.pr-otp`:**
- Delete disabled opacity and focus-visible outline rules covered by recipes.
- Do **not** add root field-shell border (border stays on `__field` / `__cell`).

**Spinner reduced-motion:** leave existing `@media (prefers-reduced-motion: reduce) { .pr-spinner { animation: none; } }` intact. The new `:root { --pr-transition-control: none; }` block is separate; if both media queries exist, that is fine (or merge into one media query with both rules — prefer one combined media query to avoid duplication):

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --pr-transition-control: none;
  }
  .pr-spinner {
    animation: none;
  }
  .pr-dialog,
  .pr-dialog-overlay {
    transition: none;
  }
}
```

Only merge if Dialog already has a reduced-motion block nearby — read current file and consolidate into a single media query without changing Dialog behavior.

- [x] **Step 9: Fix theme test selector regex if needed**

The Step 2 regex expects:

```text
.pr-input,
.pr-search,
.pr-textarea,
.pr-stepper
```

as a contiguous field-shell group. Ensure the shell recipe matches that formatting (comma + newline between selectors). If the test fails on whitespace only, adjust either the CSS formatting or the test to `toContain(".pr-input")` + `toContain(".pr-stepper")` + assert they share a rule with `border: 1px solid var(--pr-color-border)` — prefer keeping exact formatting from Step 7.

- [x] **Step 10: Run theme + token tests — expect PASS**

Run:

```bash
pnpm exec vitest run packages/tokens/src/index.test.ts packages/theme-default/src/theme.test.ts
```

Expected: PASS.

- [x] **Step 11: Guardrail check**

Confirm `theme.css` still has:
- `expect(css).not.toContain("!important")` passing
- No nested `.pr-foo .pr-bar` introduced by recipes (comma groups only)

---

## Self-review

| Spec requirement | Task |
| --- | --- |
| Interaction tokens in `TOKEN_VARS` + both tokens.css | Task 2 |
| `--pr-transition-control` + consumer override via CSS var | Task 2–3 |
| `prefers-reduced-motion` → transition none | Task 3 |
| Field shell recipe + hover without overriding invalid | Task 3 |
| Select/Time hover via local border vars | Task 3 |
| Focus ring vars replace duplicated outlines | Task 3 |
| Disabled opacity token | Task 3 |
| Chrome soft hover via surface-hover | Task 3 |
| Text button neutral hover → surface-hover | Task 3 |
| No core shell class / no solid button darken | Global + omitted |
| Contract tests | Task 1 |

No placeholders. Token names consistent across tasks. Select/Time explicitly excluded from root border shell.
