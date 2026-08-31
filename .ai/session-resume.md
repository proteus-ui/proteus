# Session Handoff

## TL;DR

- Proteus `main` @ `dacdc2d` on `origin/main` (Checkbox, Textarea, PageLoader label). Uncommitted: `"use client"` on `@packages/core/src/index.ts` (required for Next).
- job-inbox consumes Proteus via `file:../proteus/packages/{core,tokens,theme-default}` + tokens `overrides`. Not on npm. Do not publish.
- Theme CSS is loaded in `@/Users/tomasz.morawski/job-inbox/src/app/layout.tsx`. Webpack only (`next dev/build --webpack`) — Bun `file:` + Turbopack is broken.
- Already swapped: Logout `Button`, login `TextInput` + primary `Button`, Apply `Button`.
- Next chat: inventory job-inbox UI and replace every remaining primitive that Proteus already has. Domain widgets stay in the app.

## Goals

- job-inbox looks and behaves through `@proteus-ui/core` + `theme-default` wherever a matching primitive exists.
- Success: no leftover raw `<button>`, `<input>`, `<textarea>`, checkbox, or ad-hoc status chip where Proteus has an equivalent. Domain rows/filters/banner stay; they *compose* Proteus.

## Model phases & handoff protocol

- One T1 implementation pass (pattern-follow). No MAX Mode.
- Do not start `-like` themes / `createTheme` / modal stack.

## Architecture & Decisions

- Two sibling repos: `/Users/tomasz.morawski/proteus` (pnpm) and `/Users/tomasz.morawski/job-inbox` (Bun, Next 16).
- After Proteus edits: `pnpm --filter @proteus-ui/tokens --filter @proteus-ui/core build`, then `bun install` in job-inbox if the `file:` copy looks stale.
- CSS order (do not change): tokens contract → theme tokens → core `styles.css` → theme `theme.css` → job-inbox `globals.css`.
- `next/link` stays. No Proteus Link. No snackbar (noti-diva).
- Controlled APIs: `onValueChange` / `onCheckedChange`, not native `onChange`.
- Native `<details>` for skills/salary is fine; `CollapsibleSection` only if it is a clear win.
- Do not invent CheckboxGroup / Alert / EmptyState in Proteus unless a swap is blocked. Prefer Badge + text, SearchBar, Checkbox, Textarea, Card, Section, PageFrame, Spinner.
- job-inbox Tailwind is imported but unused. App chrome (`.site-nav`, `.page`) can stay CSS until it fights the theme.

## Current State

- Done (Proteus): Checkbox, Textarea, visible PageLoader label; core barrel is `"use client"` (uncommitted).
- Done (job-inbox, uncommitted): `file:` deps, `transpilePackages`, webpack scripts, theme imports, three control swaps.
- In progress: none.
- Blocked: none.

## Next Steps

1. Inventory remaining native controls in job-inbox (`src/components/*`, `src/app/**/page.tsx`).
2. Replace with Proteus: InboxFilter (SearchBar + Checkbox), FiltersEditor (TextInput, Textarea, Button, Section), AppliedRow notes (Textarea), InboxRow/AppliedRow surface (Card), RefreshBanner status (Badge), Reject/Save/Reset/refresh/add-remove (Button), pending → Spinner or `disabled`.
3. Leave domain logic (`filterJobs`, debounce notes, server actions, pinned-searches) in the app. Verify login + inbox + filters + applied in the browser.

## References

- Proteus barrel: `@packages/core/src/index.ts`
- Design spec: `@docs/superpowers/specs/2026-08-29-proteus-component-library-design.md`
- Future ideas (do not implement unless blocked): `@docs/superpowers/specs/2026-08-31-future-behaviors.md`
- job-inbox layout / theme entry: `/Users/tomasz.morawski/job-inbox/src/app/layout.tsx`
- job-inbox components: `/Users/tomasz.morawski/job-inbox/src/components/`
- Coverage notes (earlier): canvases/job-inbox-proteus-coverage.canvas.tsx
- Proteus branch: `main` @ `dacdc2d` (+ local `"use client"`)
