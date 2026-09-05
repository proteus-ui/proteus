# Text Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline; user already chose implement). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a frozen `Text` namespace of thin HTML text primitives (`Text.H1`, `Text.P`, …) on the Proteus `pr-text` + `data-tag` contract, with type-scale tokens in `theme-default`.

**Architecture:** Factory `createText(tag)` returns `forwardRef` members. `Text` is `Object.freeze({ H1, P, … })` — not a function. No slot collector. Theme styles `.pr-text[data-tag="h1"]`. Dual export: `TextH1 === Text.H1`.

**Tech Stack:** React 18/19, TypeScript, Vitest + RTL, plain CSS, `@proteus-ui/tokens`.

## Global Constraints

- Thin props only: native HTML attrs + `className` + `classNames.root`. No `size` / `weight` / `intent` / `variant` / `level` / `as`.
- Contract: `class="pr-text"` + `data-tag="<tag>"`. One slot: `root`.
- `typeof Text !== "function"`. No ESLint compound entry. No `Section.Title` change.
- Theme: low-specificity single-class + `data-*`. No `!important`. No nesting. Margin 0 on boxed tags.
- Do not commit unless the operator asks.

---

### Task 1: Failing contract tests

**Files:**
- Create: `packages/core/src/components/Text/Text.test.tsx`
- Modify: `packages/tokens/src/index.test.ts`
- Modify: `packages/theme-default/src/theme.test.ts`

**Interfaces:**
- Consumes: barrel `@proteus-ui/core` via `../../index` (same as Button)
- Produces: red tests for `Text.H1`, class merge, `Text.A` href, `Text.Br`, namespace, `TextH1 === Text.H1`, new `TOKEN_VARS`, theme selectors

- [x] **Step 1: Write the failing tests**

`packages/core/src/components/Text/Text.test.tsx` — import `{ Text, TextH1 }` from `../../index`. Cases from spec Testing section.

`packages/tokens/src/index.test.ts` — `toContain` the five new token names.

`packages/theme-default/src/theme.test.ts` — `toContain(".pr-text")` and `toContain('[data-tag="h1"]')`.

- [x] **Step 2: Run tests to verify they fail**

Run: `pnpm exec vitest run packages/core/src/components/Text/Text.test.tsx packages/tokens/src/index.test.ts packages/theme-default/src/theme.test.ts`

Expected: Text tests fail (export missing). Token/theme assertions fail (names/selectors missing).

---

### Task 2: Tokens

**Files:**
- Modify: `packages/tokens/src/index.ts` (`TOKEN_VARS` append)
- Modify: `packages/tokens/src/tokens.css`
- Modify: `packages/theme-default/src/tokens.css`

**Interfaces:**
- Produces: `--pr-font-size-lg` 18px, `--pr-font-size-xl` 24px, `--pr-font-size-2xl` 32px, `--pr-font-weight-semibold` 600, `--pr-font-mono` `ui-monospace, SFMono-Regular, Menlo, monospace`

- [x] **Step 3: Add the five tokens**
- [x] **Step 4: Re-run token test — pass**

---

### Task 3: Text component + barrel

**Files:**
- Create: `packages/core/src/components/Text/types.ts`
- Create: `packages/core/src/components/Text/consts.ts`
- Create: `packages/core/src/components/Text/Text.tsx`
- Create: `packages/core/src/components/Text/index.ts`
- Modify: `packages/core/src/index.ts`
- Modify: `packages/core/src/styles.css`

**Interfaces:**
- `createText<T extends TextTag>(tag: T): ForwardRefExoticComponent<TextProps<T> & RefAttributes<HTMLElementTagNameMap[T]>>`
- `Text` frozen namespace; standalones `TextH1`, `TextP`, …
- Void tags `br` / `wbr`: omit `children`

- [x] **Step 5: Implement factory, namespace, barrel, `.pr-text { font: inherit; }`**
- [x] **Step 6: Re-run Text tests — pass**

---

### Task 4: Theme + Storybook

**Files:**
- Modify: `packages/theme-default/src/theme.css`
- Modify: `packages/theme-default/src/theme.test.ts` (already in Task 1)
- Create: `apps/storybook/src/Text.stories.tsx`

**Interfaces:**
- Base `.pr-text`: margin 0, color text, sans, size md
- Overrides per spec Theme mapping
- Stories: `Components/Text` Scale (H1–H6 + P) and Phrasing

- [x] **Step 7: Theme CSS + stories**
- [x] **Step 8: Re-run theme test — pass. `pnpm typecheck` green.**

---

## Self-review

- Spec members, dual export, contract, tokens, theme map, tests, stories, non-goals (no ESLint parent, no Section.Title) each have a task.
- No placeholders. Types use `TextTag` / `TextProps<T>` throughout.
