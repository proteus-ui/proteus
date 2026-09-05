# Proteus — Text component

- **Status:** Draft for review
- **Date:** 2026-09-05
- **Parent spec:** [2026-08-29-proteus-component-library-design.md](./2026-08-29-proteus-component-library-design.md)
- **Repo:** `/Users/tomasz.morawski/proteus`

## Thesis

`Text` is a namespace of thin HTML text primitives. Each member is one tag. There is no extra prop for “which heading” and no renderable `<Text>` root. Appearance follows the existing contract: one class, `data-*` for which tag, tokens in the theme.

This is not a Card-style compound parent. Children are not validated. Members nest like native HTML (`<Text.P>` may contain `<Text.Strong>`).

## Goals

1. Cover HTML headings, `p` / `pre` / `blockquote`, and text-level semantics as `Text.<Tag>`.
2. Keep the API a thin layer over the native element: no `size`, `weight`, `color`, `truncate`, `variant`, `level`, or `as`.
3. Stay on the Proteus styling contract: `pr-` class, `data-*`, `classNames.root`, CSS variables.
4. Ship a readable type scale in `theme-default` without inventing heading-named tokens.

## Non-goals

- No renderable `<Text>` (not a default `<p>`, not a slot parent).
- No `collectNamedSlots` / `collectRepeatingSlot` / `@proteus-ui/compound-slots` entry for `Text`.
- No `ruby` / `rt` / `rp` (required nested structure, not a leaf).
- No lists, `address`, `figure`, `hr`, `hgroup`.
- No Proteus Link / router `Link`. `Text.A` is a native `<a>`.
- No typography props (`size`, `weight`, `intent`, `align`, `truncate`, `noOfLines`).
- No change to `Section.Title` (stays hardcoded `<h2>`).
- No job-inbox migration in this work.

## Public API

`Text` is a frozen object. `typeof Text !== "function"`. `<Text>` must not render.

```tsx
<Text.H1>Title</Text.H1>
<Text.P>
  Body with <Text.Strong>weight</Text.Strong> and <Text.A href="/x">a link</Text.A>.
</Text.P>
```

### Members

PascalCase name = HTML tag (lowercased in the DOM and in `data-tag`).

| Member | Tag | Notes |
| --- | --- | --- |
| `H1` … `H6` | `h1` … `h6` | |
| `P` | `p` | |
| `Pre` | `pre` | |
| `Blockquote` | `blockquote` | |
| `A` | `a` | native `href` and other `<a>` attrs |
| `Em` `Strong` `Small` `S` | `em` `strong` `small` `s` | |
| `Cite` `Q` `Dfn` `Abbr` | `cite` `q` `dfn` `abbr` | |
| `Data` `Time` | `data` `time` | |
| `Code` `Var` `Samp` `Kbd` | `code` `var` `samp` `kbd` | |
| `Sub` `Sup` | `sub` `sup` | |
| `I` `B` `U` `Mark` | `i` `b` `u` `mark` | |
| `Bdi` `Bdo` `Span` | `bdi` `bdo` `span` | |
| `Br` `Wbr` | `br` `wbr` | void; no `children` |

### Props

Each member is `forwardRef` to that element.

- Native HTML attributes for that tag (e.g. `TextAProps` extends `AnchorHTMLAttributes<HTMLAnchorElement>`).
- `className?: string`
- `classNames?: SlotClassNames<"root">`
- `children?: ReactNode` except `Br` / `Wbr` (omit `children` from props).

No `size`, `weight`, `color`, `intent`, `variant`, `level`, `as`, `align`, `truncate`, `noOfLines`.

### Dual export

Same function, two names, for tree-shaking:

- Namespace: `Text.H1`
- Standalone: `TextH1`

`TextH1 === Text.H1`. Barrel exports `Text` and every `Text*` standalone.

### Styling contract (SemVer)

Every member renders:

```html
<h1 class="pr-text" data-tag="h1">
```

- Class: `pr-text` (one slot: `root`).
- `data-tag` equals the HTML tag name (`h1`, `p`, `em`, …).
- `cn(TEXT_CLASS.root, classNames?.root, className)`.
- Core CSS (structural only): `.pr-text { font: inherit; }`.
- Theme targets `.pr-text[data-tag="h1"]` (low specificity, no nesting, no `!important`).

## Tokens

Add to `TOKEN_VARS`, `packages/tokens/src/tokens.css`, and `packages/theme-default/src/tokens.css`.

| Token | `theme-default` | tokens fallback |
| --- | --- | --- |
| `--pr-font-size-lg` | 18px | 18px |
| `--pr-font-size-xl` | 24px | 24px |
| `--pr-font-size-2xl` | 32px | 32px |
| `--pr-font-weight-semibold` | 600 | 600 |
| `--pr-font-mono` | `ui-monospace, SFMono-Regular, Menlo, monospace` | same |

Do not add `--pr-font-size-h1` (appearance-coupled). Do not add a 16px step; `h4`/`h5` share `--pr-font-size-md`.

Existing `--pr-font-size-sm` / `--pr-font-size-md` / `--pr-font-sans` / `--pr-color-text` / `--pr-color-text-muted` / `--pr-color-action-primary` stay as-is. Inter 600 is already imported in `theme-default`.

## Theme mapping

Base `.pr-text` (all boxed tags): `margin: 0`, `color: var(--pr-color-text)`, `font-family: var(--pr-font-sans)`, `font-size: var(--pr-font-size-md)`. Then `data-tag` overrides:

| `data-tag` | size | extras |
| --- | --- | --- |
| `h1` | `--pr-font-size-2xl` | semibold |
| `h2` | `--pr-font-size-xl` | semibold |
| `h3` | `--pr-font-size-lg` | semibold |
| `h4` `h5` | `--pr-font-size-md` | semibold |
| `h6` | `--pr-font-size-sm` | semibold |
| `small` `sub` `sup` | `--pr-font-size-sm` | |
| `code` `kbd` `samp` `var` `pre` | `--pr-font-size-sm` | `--pr-font-mono` |
| `a` | inherit | color `--pr-color-action-primary`; underline |
| `strong` `b` | inherit | semibold |
| `em` `i` | inherit | italic |
| `s` | inherit | line-through |
| `blockquote` | inherit | color `--pr-color-text-muted` |
| `mark` | inherit | background `#fef3c7` (theme CSS literal; no new token) |
| `br` `wbr` | — | no box styles |

`h4` and `h5` share size; the outline difference is the tag.

## Implementation

```
packages/core/src/components/Text/
  types.ts
  consts.ts
  Text.tsx
  Text.test.tsx
  index.ts
```

`createText(tag)` returns the `forwardRef` component. `Text` is `Object.assign` / object literal of members, then `Object.freeze`. `Text` is not a function.

Void members (`Br`, `Wbr`) do not pass `children` through.

Files to touch besides the new folder:

- `packages/core/src/index.ts` — export `Text` + standalones + types
- `packages/core/src/styles.css` — `.pr-text { font: inherit; }`
- `packages/tokens/src/index.ts` — append the five new `TOKEN_VARS`
- `packages/tokens/src/tokens.css` — fallback values
- `packages/theme-default/src/tokens.css` — default values
- `packages/theme-default/src/theme.css` — `.pr-text[data-tag="…"]`
- `packages/theme-default/src/theme.test.ts` — assert `.pr-text` and one `data-tag` selector
- `apps/storybook/src/Text.stories.tsx`

Do not add `Text` to `packages/core/eslint/compounds.js`.

## Testing

Vitest, import from `@proteus-ui/core` barrel (same as Button / Section).

- `Text.H1` renders `<h1 class="pr-text" data-tag="h1">`
- `classNames.root` and `className` both land on the element
- `Text.A` preserves `href`
- `Text.Br` is a `<br>` with no children
- `typeof Text !== "function"`
- `TextH1 === Text.H1`
- `TOKEN_VARS` contains the five new names
- Theme CSS contains `.pr-text` and a `[data-tag=` selector; still no `!important`

Storybook: `Components/Text` with a Scale story (H1–H6 + P) and a Phrasing story (nested Strong / Em / A / Code / …).

## Error handling

None beyond React. Invalid children are not a library error: members accept `ReactNode` like a native tag. There is no parent to throw `COMPOUND_ERROR`.

## Decisions (locked)

| Topic | Choice |
| --- | --- |
| Surface | One member per tag (not `Text.Header` + `level`) |
| Root | Namespace only; `<Text>` does not render |
| Props | Thin native attrs + `className` + `classNames.root` |
| Contract | `pr-text` + `data-tag` |
| Heading rank prop | Not used (`variant` is Button skin; `size` is scale; rank is the member name) |
