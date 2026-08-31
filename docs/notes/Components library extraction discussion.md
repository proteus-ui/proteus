

Analysis done across all six repos. One finding up front that reframes everything: `Visualizer` and `flow-observer/apps/visualizer` are the same codebase — identical component lists, tokens, and hooks. Treat them as one source.

## Per-repo extraction viability

|Repo|Stack|Styling|Has real components?|Role in a shared lib|
|---|---|---|---|---|
|id-page|Next 16 / React 19 / TS|Tailwind v4 `@theme` + TS design-token layer + `cn()`|Yes, clean|Foundation — best architecture|
|flow-observer (= Visualizer)|Next 16 / React 19 / TS|Tailwind v4 + CSS vars + `FLOW_THEME` object, no `cn()`|Yes, but ~80% domain-locked in `flow-diagram/`|Primary donor of primitives + hooks|
|git-timelines|React 18 / Vite 6 / TS|Inline styles + `theme` const (Tailwind installed, unused)|Yes, but inline-styled + React 18|Secondary donor, needs restyle|
|form-flow-maestro|Chrome ext / TS / Webpack|Plain CSS + HTML partials, vanilla DOM|No — imperative DOM only|Consumer of CSS tokens only, not React|
|noti-diva|TS library (published)|Plain CSS, class-override API|No — it's the notification lib|Already the shared package; keep as dependency|

`noti-diva` is the key precedent: every React app here already depends on it. It's the model — a small, framework-light, independently published package. The new UI lib should sit beside it, not absorb it.

## Real overlap (what's worth extracting)

Components that actually recur across repos:

- Badge — id-page + flow-observer/Visualizer
- Button — id-page (`variants+sizes`), git-timelines (`IconButton`/`OutlineButton`); inline elsewhere
- Modal / ConfirmationModal — flow-observer, Visualizer, git-timelines (3+ ad-hoc copies sharing overlay + centered panel + action row)
- Tooltip — flow-observer/Visualizer (Radix wrapper)
- Search / text inputs — flow-observer `SearchBar`, git-timelines `AppInput`/`NumberStepper`/`TimeInput`, id-page gaps
- Card / Section / LinkCard / PageFrame — id-page (generic), flow-observer (domain cards)
- CollapsibleSection, ToolbarButton, InlineEditControls, EntitySelector, PageLoader, ErrorBoundary — flow-observer/Visualizer
- Hooks — `useCloseOnEscape`, `useCloseOnOutsideClick`, `useModalCloseHandlers`, `useInlineEdit`, `useSearchFilter`, `useConfirmation`, `useAsyncOperation` (identical set in flow-observer/Visualizer, reusable everywhere)
- `cn()` — only id-page has it; everything else needs it

## The blocker: no shared styling contract

This is the real obstacle, not the components themselves. Four incompatible token systems today:

- id-page: TS primitives → semantic tokens → CSS-variable adapter + Tailwind v4 `@theme`. Proper.
- flow-observer/Visualizer: CSS vars and a `FLOW_THEME` JS object and Tailwind — three sources, duplicated.
- git-timelines: a single `theme` const consumed via inline `style={{}}`.
- form-flow-maestro: hardcoded CSS custom properties.

Plus version skew: React 19 (id-page, flow-observer) vs React 18 (git-timelines), and one non-React consumer (form-flow-maestro).

You can't extract components cleanly until one token system wins. id-page's design-system layer is the only one built for this and should be the standard.

## Recommended shape

A single scoped package, published to a GitHub repo, e.g. `@tomaszm/ui`:

@tomaszm/ui

├── tokens/ # lifted from id-page design-system; emits CSS vars + Tailwind v4 preset

├── lib/cn.ts # from id-page

├── components/ # Button, Badge, Card, Section, Modal, Tooltip, SearchBar,

│ # Input, NumberStepper, CollapsibleSection, ToolbarButton,

│ # InlineEditControls, EntitySelector, PageLoader, ErrorBoundary

├── hooks/ # useCloseOnEscape, useCloseOnOutsideClick, useInlineEdit,

│ # useSearchFilter, useConfirmation, useAsyncOperation

└── styles.css # token defaults + Tailwind layer

- Build with `tsup` (dual ESM/CJS), `react`/`react-dom` as peer deps, ship the Tailwind v4 preset for token bindings.
- Seed from id-page (tokens, `cn()`, Button/Card/Badge/Section/PageFrame), then port flow-observer/Visualizer primitives + hooks onto those tokens, then generalize the Modal from the three git-timelines copies.
- Target React 19; git-timelines needs a React 18→19 bump or a peer range `^18 || ^19`.
- noti-diva stays separate, listed as a peer/sibling. form-flow-maestro consumes only the exported CSS tokens (it can't take React components).
- Excluded as too domain-coupled: `flow-diagram/*`, React Flow nodes, `lens-scene` WebGL effects, Monaco wiring.

## Realistic effort

- Genuinely shared, low-coupling primitives: roughly 12–15 components + 6 hooks + token layer.
- ~80% of flow-observer/Visualizer and most of git-timelines' timeline UI is domain code that should not move.
- Biggest cost is not extraction — it's converting git-timelines off inline styles and consolidating flow-observer's triple token system onto id-page's model.

Want me to take the next step — brainstorm the package design in depth (naming, token strategy, migration order per repo) and write an implementation plan, or scaffold the repo and seed it from id-page? I'd run the brainstorming skill first for the design decisions.

1. lets focus on extraction. Consolidation of all the projects will come sometime in future.

2. I would like to have as little deps as possible on the side of the components library repo.

3. Would it be possible to not create strong dep. on tailwind (or anything else at that matter) and instead support ability for client to provide entity fulfilling expected contract (might be tailwind, might be raw css, could be one of preprocessors) as a "parameter"?

Let me walk through the three concretely. Assume a `Button` with parts `root` and `icon`, and states like `disabled` / variant `intent`.

### Option A — class-name strings only

The component renders structure and applies whatever class strings you hand it per slot. It never knows what produced them.

// Library side (simplified)

function Button({ classNames, intent, disabled, children }: ButtonProps) {

return (

<button

className={classNames?.root}

data-intent={intent}

data-disabled={disabled || undefined}

disabled={disabled}

>

{children}

</button>

);

}

Consumer wires styling per system:

// Tailwind consumer

<Button classNames={{ root: "px-4 py-2 rounded bg-pink-500 disabled:opacity-50" }} />

// Raw CSS / Sass consumer (classes defined in their own stylesheet)

<Button classNames={{ root: "btn btn--primary" }} />

- Styling deps in the library: zero.
- Contract is just a typed object of `string`s. Trivial to understand and stable.
- Covers Tailwind, raw CSS, CSS Modules, Sass/Less — all compile to class strings.
- Weakness: styling that depends on _runtime state_ (e.g. "50% progress width") can't be a static class. But those cases are handled by exposing `data-*` attributes (as above) so the consumer targets `[data-disabled] {}` / `[data-intent="danger"] {}` in their own CSS or Tailwind variants. So state-based styling still works — it just lives in the consumer's stylesheet, not passed through props.

### Option B — class names _and_ inline style objects

Same as A, but each slot also accepts a React `style` object, merged in.

<Button

classNames={{ root: "btn" }}

styles={{ root: { width: `${pct}%` } }}

/>

- Still near-zero deps.
- Handles dynamic numeric values (widths, transforms, computed colors) directly without a `data-*` + CSS dance.
- Cost: two parallel channels (`classNames` + `styles`) per slot — more surface, and consumers can express the same thing two ways, which invites inconsistency. `git-timelines` today is _entirely_ inline-style-driven, so this maps to how one of your repos already works.

### Option C — a styling resolver "entity" (adapter)

The consumer provides one object implementing an interface; the library calls it for every part.

// The contract the consumer fulfills

interface StyleAdapter {

resolve(component: string, part: string, state: Record<string, unknown>): {

className?: string;

style?: CSSProperties;

};

}

// Provided once via context

<UIProvider adapter={myTailwindAdapter}>...</UIProvider>

- Most powerful: one place defines styling for the whole app; also accommodates CSS-in-JS (Emotion, styled-components) since the adapter can return anything.
- Best "theme swap" story — change the adapter, restyle everything.
- Cost: the contract is now _behavioral_, not just data. Every consumer must implement a resolver before they can render a single button. That's real friction for small apps like `id-page`, and it's a heavier, more abstract contract to keep stable across versions. It also tends to pull a provider/context requirement into the library.

### How they stack against your constraints

||Deps added|Contract complexity|Covers Tailwind|Covers raw CSS / preprocessors|Covers CSS-in-JS|Per-consumer setup cost|
|---|---|---|---|---|---|---|
|A classNames|none|lowest (data object)|yes|yes|via className only|lowest|
|B + styles|none|low|yes|yes|partial|low|
|C adapter|none required, but pulls a provider|highest (behavioral)|yes|yes|yes|highest|

### My recommendation

Option A as the core contract, with Option B's `style` escape hatch added only where genuinely needed (a handful of components with runtime-dynamic geometry). Reasoning:

- It matches your two hard constraints best: zero styling deps, and the contract is pure data (strings), which is the easiest thing to keep stable and the easiest for any consumer to fulfill regardless of styling system.
- It's the same mental model as `noti-diva`, so your ecosystem stays consistent.
- `data-*` state attributes give you state-driven styling (hover/disabled/active/variant) without inventing a resolver protocol — the consumer's own CSS/Tailwind handles states, which is idiomatic in all three of your target styling systems.
- Option C's power (global theme swap, CSS-in-JS) isn't something your current repos need — none of them use CSS-in-JS, and "consolidation comes later." You can _add_ an adapter layer on top of A in the future without breaking the slot contract. Starting with C would tax every small app now for flexibility you don't yet use (YAGNI).

So: components expose a documented set of slots (named parts) and emit `data-*` state/variant attributes; consumers pass a `classNames` slot map, and a few dynamic components additionally accept a `styles` slot map.

Does Option A (+ targeted `style` escape hatch) sound right, or do you want the full adapter (C) despite the per-consumer cost?

and how do popular component libraries that are already on the market approach that?

shadcn

ant

material

etc.