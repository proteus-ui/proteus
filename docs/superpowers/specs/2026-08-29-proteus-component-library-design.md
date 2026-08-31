# Proteus — Design Spec

- **Status:** Draft for review
- **Date:** 2026-08-29
- **npm scope:** `@proteus-ui/`* (org `proteus-ui` created and owned; `@proteus` was taken by an existing npm user)
- **Repo:** `/Users/tomasz.morawski/proteus` (new, to be hosted on GitHub)

## Name & thesis

Named for **Proteus**, the Greek sea god who assumes any shape while remaining one being. The library is one invariant behavioral core that can wear many outward appearances. Every incumbent (Material UI, Ant Design, Chakra) welds a single look to a single styling engine; Proteus deliberately separates *behavior* from *appearance* so one core can present as Material-like, Ant-like, or its own default — while the improvements underneath (performance, RSC-friendliness, override ergonomics, accessibility) come free under whichever skin is chosen.

## Goals

1. Extract the genuinely reusable UI primitives currently duplicated across the author's projects (`flow-observer`/`Visualizer`, `id-page`, `git-timelines`, and CSS-only patterns in `form-flow-maestro`) into one installable, GitHub-hosted library.
2. Be **styling-system agnostic**: the library imposes no styling engine on the consumer. Tailwind, raw CSS, or a preprocessor can all fulfil the same contract.
3. Ship a **default stylesheet** (the author's own look) so the library is usable out of the box, not unstyled.
4. Keep **runtime dependencies minimal** and incur **zero style runtime** (no CSS-in-JS, no registry shim, RSC/SSR friendly by construction).
5. Support **swappable theme packages**, including presets that mimic the *look* of established libraries (`theme-material-like`, `theme-ant-like`).



## Non-goals (explicit, first iteration)

- **No behavioral parity with incumbents.** First iteration mimics *look only* — colors, radii, spacing, density, typography, focus treatment. Interaction feel/motion stays Proteus's own consistent behavior. (Behavioral emulation is a possible future direction, explicitly deferred.)
- **No breadth race.** Not attempting to match MUI/Ant component counts, data grids, date pickers, or i18n depth. Proteus targets a curated primitive set.
- **No porting of an incumbent's styling substrate.** Sophisticated behaviors are sourced by depending on standalone primitives or reimplementing from reference — never by copying an engine-coupled implementation in place.
- **No CSS-in-JS / runtime theming engine.**



## Architecture

Behavior and appearance are separated into distinct packages joined by a small, stable contract.

```
@proteus-ui/core            headless components + behavior + a11y + minimal default CSS
@proteus-ui/tokens          the contract: slot names, data-* state vocabulary, CSS-variable token names (types + docs)
@proteus-ui/theme-default   the author's own look (token values + CSS)   [iteration 1]
@proteus-ui/theme-material-like   Material-look token set + CSS over the same core   [roadmap]
@proteus-ui/theme-ant-like        Ant-look token set + CSS over the same core        [roadmap]
```

Iteration 1 ships only `theme-default`. The `-like` mimic themes are on the roadmap (see Roadmap), deferred behind higher-priority quality work.

- **Core** renders semantic markup, wires behavior and accessibility, applies stable namespaced class names per part, and emits `data-`* attributes for state and variant. It ships a minimal default stylesheet so it works standalone.
- **Theme packages** contain only appearance: a set of CSS-variable token values plus CSS that targets the core's documented slots/`data-`*. Swapping a theme is swapping a stylesheet/token set — no code change, no engine.
- **Tokens** is the published definition of the contract that both core and themes depend on.



### Methodology positioning

Atomic Design and the token/theme abstractions sit on **different axes**. They rhyme ("small → large") but organize different substances. Conflating them is how people try to map `atoms → molecules → organisms` onto `primitive → semantic → component` tokens — those are different ladders.


| Axis                                       | Question                                         | Methodologies                                                                    | Proteus layer                       |
| ------------------------------------------ | ------------------------------------------------ | -------------------------------------------------------------------------------- | ----------------------------------- |
| **1. Value / decision layering**           | How do design *values* flow and stay consistent? | Design tokens (primitive → semantic → component), theme generators, W3C DTCG     | `@proteus-ui/tokens` + `theme-`*    |
| **2. Component granularity / composition** | How do *components* break down and compose?      | Atomic Design, flat Component-Driven Development, primitive/pattern/layout tiers | `@proteus-ui/core` organization     |
| **3. Behavior vs presentation**            | Where does logic end and styling begin?          | Headless/styled split, compound components                                       | `core` (behavior) vs `theme` (skin) |


**Atomic Design is Axis 2 only.** It says nothing about tokens, contrast, or adapters (Axis 1), and nothing about whether behavior is headless (Axis 3). An atom (`Button`) already consumes all three token tiers. AD therefore lives in the **component-library** space, not in the design-system/token core — which is why Proteus does not organize packages or folders as `atoms/` / `molecules/` / `organisms/`.

**Proteus's primary decomposition is Axis 3 + Axis 1** (headless core + swappable theme + semantic tokens). On Axis 2 we use **flat Component-Driven Development**: a catalog under `components/` + `hooks/`, matching how Radix, MUI, Chakra, and shadcn/ui actually ship. Atomic Design is kept as a **complexity lens** for scoping and sequencing (`Button` = trivial atom → `SearchBar` = controllable molecule → `Dialog` = behavior/a11y organism), not as a folder structure or API contract. Templates/pages in AD belong to consumer apps, not the library.

**Axis-2 alternatives (not adopted as taxonomy):**

- **Three-tier primitive / pattern / layout** — AD collapsed to the tiers that survive in a real library. Compatible with flat CDD; we may use the words informally.
- **Feature / domain-driven folders** — common in apps, wrong for a shared primitive library.
- **CSS-architecture methodologies** (BEM, ITCSS, SMACSS) — organize stylesheets, not components. Theme CSS already uses BEM-flavored `pr-dialog__title` names; that is Axis-1/3 delivery, not Axis 2.



### The styling contract (public API)

The contract is the real product surface and is governed like an API. It has three parts:

1. **Slots** — each component exposes named parts (e.g. Button: `root`, `icon`; Modal: `overlay`, `panel`, `title`, `actions`). Consumers pass a `classNames` map keyed by slot to attach their own classes (Tailwind strings, CSS-module classes, plain class names — the library does not care which). This is the noti-diva / Mantine Styles API model.
2. **State & variant via** `data-`* **attributes** — components render `data-`* (e.g. `data-disabled`, `data-intent="danger"`, `data-state="open"`). State-dependent styling lives in the consumer's own CSS/Tailwind variants (`[data-state="open"]`, `data-[state=open]:`), so no styling engine is required to express states.
3. **Design tokens as CSS variables** — theming is driven by CSS custom properties set on `:root`/`[data-theme]`. Names are **intent-based (semantic)**, not appearance-based: `--pr-color-action-primary` + its paired `--pr-color-on-action-primary`, `--pr-color-feedback-error`, `--pr-color-surface`, `--pr-color-text`, `--pr-radius-md`, etc. — never `--pr-pink-500`. Components reference meaning, so a re-theme (or dark mode) is a new value set for the same names, with no component changes. Themes are token sets; consumers retheme without touching component internals.

A **targeted** `styles` **escape hatch** (per-slot inline `CSSProperties`) is provided only for the small number of components needing runtime-dynamic geometry (e.g. computed widths). It is not the primary channel.

**Contract governance:** slot names, the `data-`* vocabulary, and CSS-variable token names are SemVer-protected surface from day one. Keep them minimal and well-named; renaming any of them is a breaking change across every theme and consumer. This is the "done once, stays forever" investment — its longevity depends entirely on designing it minimal and correct early.

### Default stylesheet authoring — decided: plain CSS

Author the default and theme CSS as **plain CSS with a** `pr-` **namespaced single-class +** `data-`* **selectors, kept at low specificity** (no nesting, no `!important`). Rationale:

- **Theming is cross-package and global.** Theme packages target the core's parts (e.g. `.pr-button[data-intent="danger"]`), which requires stable, globally-targetable selectors. CSS Modules scopes/hashes names locally; sharing selectors across packages would force `:global(...)` everywhere — reinventing plain global classes and discarding the only benefit Modules provides.
- **Predictable consumer overrides.** Consumers override documented `.pr-`* classes and `data-*` states directly; under Modules the shipped classes are opaque hashes.
- **Simplest distribution.** A plain `.css` file needs no bundler transform; Modules assumes the consumer's build resolves modules (or you precompile to global CSS anyway).
- **Specificity guarantee.** Flat single-class selectors ensure a consumer's own class wins.
- The one Modules advantage — automatic scoping — is replaced by a strict `pr-` prefix; the collision risk is small and controllable.



### Behavior sourcing strategy

For sophisticated behaviors (focus trapping, positioning, dismissable layers, keyboard navigation), in preference order:

1. **Depend on the already-un-welded standalone primitive** (e.g. Floating UI for positioning; React Aria hooks for a11y) as a per-component, tree-shakeable dependency.
2. **Reference + reimplement** against the Proteus core and contract (behaviors/ideas are not copyrightable; concrete expression is).
3. **Literal port** only for a self-contained algorithm with no substrate coupling, complying with the source's (permissive MIT/Apache) attribution requirements.

Trademark note: reproduce visual languages, but name presets `*-like` and never brand or imply endorsement by Material/MUI/Ant.

### Accessibility strategy

a11y is built into every component from its first test (TDD), not deferred to a phase. Sourcing is **tiered**:

- **Simple components** (Button, Badge, Card, Section, inputs): native semantics + minimal ARIA, hand-written, **zero dependencies**.
- **Behavior/a11y-heavy components** (Dialog focus trap + restoration via `@react-aria/focus` `FocusScope`, body scroll lock via `@react-aria/overlays` `usePreventScroll`, background hidden from assistive tech via `ariaHideOutside`, plus a `data-state` two-phase enter/exit transition; Select listbox semantics + typeahead; Tooltip timing/dismissal): **depend on React Aria hooks** (`@react-aria/`*, Apache-2.0). Rationale: React Aria ships **hooks that return prop-getters spread onto Proteus's own DOM**, which fits the "our markup, our slots, our `data-`*" contract — unlike Radix Primitives, whose a11y is delivered as components that render *their* DOM tree. The dependency is per-component and tree-shakeable, so a consumer importing only `Button` pays nothing.

This is a deliberate, bounded exception to the "minimal deps" goal: correct a11y for the few hard components outweighs re-deriving cross-browser/screen-reader focus management by hand.

## Performance & compatibility principles

- **Zero style runtime** — appearance is static CSS; nothing is computed at render.
- **RSC / Next App Router native** — one `import "@proteus-ui/core/styles.css"`; no `useServerInsertedHTML`, no style registry, no forced `"use client"` root boundary.
- **Tree-shakeable** — per-component entry points and correct `sideEffects` so consumers pay only for what they import; CSS importable per-component or as one file.
- **Minimal deps** — core aims for `clsx`-or-hand-rolled class joining only (no `tailwind-merge`, since Proteus is not Tailwind-coupled). Heavier behavior deps are opt-in per component.
- **React support** — target React 19; declare peer range `^18 || ^19` so the React-18 consumer (`git-timelines`) can adopt without an immediate upgrade.



## Component scope

Iteration 1 covers the **full set of genuinely shared, low-coupling primitives** identified in the cross-project extraction analysis (not a reduced slice). The default theme (`theme-default`) ships with them; the `-like` mimic themes are roadmap, so the multi-skin thesis is proven structurally (core + contract + default theme) and demonstrated with additional skins later.

**Components:**

- `Button`, `IconButton`, `OutlineButton`
- `Badge` / `Pill`
- `Card`, `Section`, `LinkCard`, `PageFrame`
- `Input` / `TextInput`, `SearchBar`, `NumberStepper`, `TimeInput`, `Select`
- `Modal` / `Dialog` (generalized from the three ad-hoc copies in `git-timelines` + `ConfirmationModal` in flow-observer)
- `Tooltip`
- `CollapsibleSection`
- `Toolbar` / `ToolbarButton`
- `InlineEditControls`
- `Spinner` / `PageLoader`
- `ErrorBoundary`

**Hooks:** `useCloseOnEscape`, `useCloseOnOutsideClick`, `useModalCloseHandlers`, `useInlineEdit`, `useSearchFilter`, `useConfirmation`, `useAsyncOperation`, `useControllableState`.

**Utilities:** `cn()` (clsx-based or hand-rolled; no `tailwind-merge`) and the token layer in `@proteus-ui/tokens`.

Complexity varies across this set (a `Button` is trivial; `Dialog`, `Tooltip`, `Select`, `TimeInput` need real behavior/a11y work) — all are in scope, sequenced by the implementation plan.

**Not included:** notifications are already covered by the standalone `noti-diva` package, which stays separate and is consumed as-is. Excluded as domain-coupled: `flow-diagram/`*, React Flow nodes, `lens-scene` WebGL effects, Monaco wiring.

## Build & tooling (proposed)

- Monorepo for `core` / `tokens` / `theme-*`. **Package manager: pnpm workspaces (recommended)** — its strict dependency isolation mechanically prevents undeclared/phantom deps and keeps `react` an honest peer, which matters more for a library than raw install speed. **Bun** is a sanctioned alternative given the author already uses it in `git-timelines`; the package manager does not leak to consumers, so it is purely a DX choice. Either way, use `tsup` for the build.
- `tsup` for dual ESM/CJS + `.d.ts`, per-component entry points.
- React as peer dependency; strict TypeScript.
- Design-token source: adopt/extend `id-page`'s existing token layer (primitives → semantic → CSS-variable adapter) as the starting point for `@proteus-ui/tokens` and `theme-default`, since it is the cleanest existing implementation among the source projects.



## Testing approach

- Contract tests: components render expected slots and `data-*` for each state/variant.
- Override tests: consumer `classNames`/`styles` reach the correct slots; consumer classes win over defaults (specificity guarantee).
- Theme smoke tests: same component under `theme-default` vs a `-like` theme differs only in appearance/tokens, not structure.
- Accessibility checks on interactive components (Dialog, Tooltip): focus, escape, ARIA wiring.



## Consumers & migration

Target consumers are the author's existing projects. `id-page` (React 19, already token-driven) is the natural first adopter and token donor. `flow-observer`/`Visualizer` and `git-timelines` follow; `git-timelines` also needs a move off inline styles. `form-flow-maestro` (non-React Chrome extension) can consume only the CSS token layer, not the React components.

## Roadmap (post-iteration-1)

Deferred behind higher-priority quality work on the core and default theme:

- `-like` **mimic themes** — visual/token parity presets (`theme-material-like`, `theme-ant-like`, …). Look only, no behavioral parity. Order TBD when picked up.
- **Build-time theme generator (**`createTheme`**)** — see the self-contained design below.
- **Stacked modal manager (**`ModalStackProvider`**)** — see the self-contained design below.
- **Future behaviors** — `[2026-08-31-future-behaviors.md](./2026-08-31-future-behaviors.md)`. Ideas only; pick up with a new plan.
- **Deferred components/behaviors** as needs emerge (e.g. richer data components).
- **Possible future:** behavioral emulation of incumbents (explicitly out of scope for now).



### Build-time theme generator (`createTheme`) — self-contained design

Iteration 1 hand-authors `theme-default` as static CSS. A later iteration can add a **pure-function generator** that derives a full semantic token set from a small identity input, then **emits static CSS at build time**. This keeps the zero-runtime / RSC-native guarantee (no runtime injection, no `"use client"`) while removing the drift and hand-maintenance of authoring every theme's CSS by hand. It is the deterministic way to produce `theme-default`, the `-like` skins, brand white-labels, and dark mode. This section captures the design so it can be built without the archived research notes it derives from.

**Shape:** a pure function, no side effects, usable at build time in any runtime:

```ts
type Mode = "light" | "dark";
type Emphasis = "soft" | "balanced" | "strong";

interface ThemeInput {
  brand: { primary: Color };                                  // highest-leverage identity input
  feedback: { success: Color; warning: Color; error: Color; info: Color };
  neutral: { scale: NeutralScale };                           // text/surface/border backbone
  mode: Mode;                                                 // a transformation, not a separate theme
  contrast: { textOnColor: "AA" | "AAA" };                    // drives on-* selection
  emphasis?: Emphasis;                                        // border strength, hover deltas, disabled opacity
}

function createTheme(input: ThemeInput): SemanticTokens;       // → the `--pr-*` values
```

**Input discipline (what is and is NOT a parameter):**

- **Parameters** are identity-defining primitives only: brand accent, feedback hues, neutral scale, mode, contrast policy, optional emphasis. Changing one changes the whole visual personality predictably.
- **Never parameters:** per-component colors, raw hue scales (`pink`/`green`), tooltip/button/node styling. "If it affects only one component, it is not a generator concern." Those are derived.

**Output:** semantic tokens only — the same intent-based `--pr-`* names the components already consume (`--pr-color-action-primary` + `--pr-color-on-action-primary`, `--pr-color-feedback-*`, `--pr-color-surface`, `--pr-color-text*`, `--pr-color-border`, plus radius/space/font). The generator computes tints/shades, and — driven by `contrast` — picks each `on-*` foreground to satisfy the AA/AAA ratio (accessibility enforced at token level, not left to authors).

**Three-tier internal model** (primitives → semantic → optional component tokens): primitives (raw hex) exist only inside the generator and are never emitted for direct component use; components bind to semantic tokens; component tokens (e.g. for diagram UI) are an optional layer that references semantics only.

**Emission (why it stays RSC-safe):** the generator runs in the build/CLI step and writes a static `tokens.css` (`:root` / `[data-theme="…"]` blocks). Because emission is **build-time**, there is no runtime style computation, no CSS-in-JS, and no server style registry — identical delivery characteristics to today's hand-authored CSS, but with TypeScript as the source of truth (typing + enforcement) and multi-theme output for free. Dark mode is just `createTheme({ …, mode: "dark" })` emitted under `[data-theme="dark"]`.

**Multi-framework fit:** the generator and its token output are framework-agnostic (this is why `@proteus-ui/tokens` carries no React dependency). A future Vue/Angular/Svelte adapter consumes the same emitted CSS variables — only the component layer differs.

**Why deferred:** iteration 1's single `theme-default` doesn't need generation, and the color-derivation math (tint/shade curves, contrast solving) is real work. Adopting semantic token *names* now (done) is the prerequisite that makes this generator a drop-in later — it only changes how the `--pr-`* values are produced, never the contract components depend on.

### Stacked modal manager — self-contained design

Iteration 1 ships a single, self-contained `Dialog`. A later iteration can add an app-level **stack manager** that layers N modals, keeps only the top one interactive, and supports both imperative and declarative opening. This section captures the full architecture. It layers on top of — and reuses — the iteration-1 `Dialog` primitives (`FocusScope`, `usePreventScroll`, `ariaHideOutside`, the `data-state` two-phase transition).

**Package split (mirrors core/theme):**

- `unstyled` layer — provider, reducer, portal, focus/scroll/aria behavior, transition. No styling. This is the equivalent of `@proteus-ui/core`.
- `branded` layer — per-theme renderers registered by identifier, plus CSS. Equivalent to a theme package.

**Stack state (reducer):** the stack is an ordered array of **entries**, bottom → top:

```ts
type StackEntry = {
  id: string;                 // generated on open (uuid/nanoid)
  renderData: {               // which renderer + its props
    modalIdentifier: string;  // key into the renderer registry
    modalProps: unknown;      // props passed to that renderer
  };
  modalConfig?: {
    closeOnEsc?: boolean;     // default true; only the TOP entry reacts to Esc
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
  };
  onClose: (id: string) => void;
};

type StackAction =
  | { type: "OPEN"; entry: StackEntry }
  | { type: "CLOSE"; id: string }
  | { type: "SYNC_PROPS"; id: string; renderData: StackEntry["renderData"]; modalConfig?: StackEntry["modalConfig"] };
```

- `OPEN` appends an entry. `CLOSE` removes the entry with `id`. `SYNC_PROPS` replaces `renderData`/`modalConfig` for an existing `id` so an open modal re-renders with new content/props.
- The reducer must be usable with **local** `useReducer` or an **injected external store** (e.g. Redux) via an `externalStackState` prop — expose plain action creators so both paths dispatch the same actions.

**Provider + context API:**

```ts
type ModalStackContextValue = {
  openModal(renderData, onClose, modalConfig?): string; // returns entry id
  syncPropsToStackedModal(id, renderData, modalConfig?): void;
  closeModal(id): void;
};
```

- `openModal` generates an id, dispatches `OPEN`, returns the id. `closeModal` dispatches `CLOSE`. Validate `renderData.modalIdentifier` against the registry and throw on unknown identifiers.
- The provider accepts: `modalRenderers` (registry `modalIdentifier → React component`), `overlayClassName`, `dialogClassName`, `portalTargetElement` (default `document.body`), and optional `externalStackState`.

**Rendering (portal):** when `stack.length > 0`, render via `createPortal(…, portalTargetElement)`:

- One **overlay** (backdrop): `data-state` for its own transition; `onMouseDown` closes the **top** entry when the target is the overlay itself; `aria-hidden` so only the top modal is in the a11y tree.
- One **container per entry** (bottom → top): `role="dialog"`, `aria-modal="true"`, a11y attrs from `modalConfig`, `z-index = base + index`, focus trap (reuse `FocusScope`), and the `data-state` transition. Inside each, render `modalRenderers[entry.renderData.modalIdentifier](entry.renderData.modalProps)`.
- Body scroll lock (`usePreventScroll`) engages while the stack is non-empty; `ariaHideOutside` targets the top container.

**Two entry points (both funnel into the reducer):**

- **Imperative:** `const { openModal } = useModalStack(); const id = openModal(renderData, onClose, config)`.
- **Declarative:** a `<Modal isOpen onOpenChange … />` wrapper that syncs one entry to the stack. It composes:
  - `useDialogTransition(isOpen)` → drives mount/visibility so enter/exit animations run even as the stack pushes/pops.
  - a lifecycle hook: on mount → `openModal(...)`, store the returned id; on prop change → `syncPropsToStackedModal(id, ...)`; on unmount/close → `closeModal(id)` and run the caller's `onClose`.

**Per-modal behavior:**

- **Esc:** a single keydown listener (active while the stack is non-empty) closes the **top** entry unless its `modalConfig.closeOnEsc === false`.
- **Overlay click:** closes the **top** entry.
- **Focus:** trap within the top container (reuse `FocusScope contain restoreFocus autoFocus`); this supersedes any hand-rolled trap and adds focus restoration.
- **Robustness:** wrap each entry's rendered content in an `ErrorBoundary`, keyed by transition phase so a thrown child resets cleanly between phases.

**Why deferred:** none of the six source projects required stacking; the single `Dialog` covers current needs. The stack manager is a distinct, app-level capability whose cost (provider wiring, reducer, registry, external-state contract) is not justified until a consumer needs layered modals.

**Implement the stack using** `[2026-08-31-future-behaviors.md](./2026-08-31-future-behaviors.md)` (modal stack): honor `closeOnEsc` / `closeOnOverlayClick` on the **top** entry; overlay close is `mousedown` + `target === currentTarget`; `z-index = 999 + index`; IDs via `useId` / `crypto.randomUUID()`; reuse `useDialogTransition` with the ref **actually attached** (duration is **0** when there is no CSS transition).

### Future behaviors

Ideas for later work: `[2026-08-31-future-behaviors.md](./2026-08-31-future-behaviors.md)`. Iteration-1 plans are shipped on `main`; `-like` themes / `createTheme` / modal stack stay on the [Roadmap](#roadmap-post-iteration-1).

## Resolved decisions

1. **Default CSS authoring:** plain CSS with `pr-` namespaced, low-specificity selectors. (See authoring section.)
2. **Component set:** the full shared-primitive set above (not trimmed).
3. `-like` **themes:** moved to Roadmap; iteration 1 ships `theme-default` only.
4. **Package manager:** pnpm recommended; Bun sanctioned alternative.
5. **npm scope:** `@proteus-ui` — org `proteus-ui` created and owned (`@proteus` was taken by an existing npm user). Scoped packages publish with `publishConfig.access: "public"`.
6. **Component organization:** flat Component-Driven Development (`components/` + `hooks/`). Atomic Design is a complexity lens only, not folders or public API. See Methodology positioning.
7. **Future ideas:** `[2026-08-31-future-behaviors.md](./2026-08-31-future-behaviors.md)`. Styling delivery is inverted (slots/`data-*`, not class maps).



## Open decisions (for review)

None outstanding — spec ready for implementation planning.

## References

- Comparison of incumbent approaches: canvas `UI-library-comparison.canvas.tsx`.
- Source projects analyzed: `flow-observer`, `form-flow-maestro`, `git-timelines`, `id-page`, `noti-diva`, `Visualizer`.
- Future ideas: `[2026-08-31-future-behaviors.md](./2026-08-31-future-behaviors.md)` plus the stacked-modal section above.

