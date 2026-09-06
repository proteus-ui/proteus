# Proteus

React component library with a stable styling contract and a shippable default theme.

Behavior lives in `@proteus-ui/core`. Appearance lives in theme packages over `@proteus-ui/tokens`. Swap the skin without rewriting components — no CSS-in-JS, no style runtime.

**[Browse Storybook →](https://proteus-storybook-blond.vercel.app)**

## Why

Most UI kits weld one look to one styling engine. Proteus separates those layers:

| Layer | Package | Responsibility |
| --- | --- | --- |
| Behavior | `@proteus-ui/core` | Markup, a11y, interaction, compound slots, `data-*` state |
| Contract | `@proteus-ui/tokens` | Token names and the shared CSS-variable vocabulary |
| Appearance | `@proteus-ui/theme-default` | Token values + styles that target core slots |

Themes are stylesheets. Consumers can also style via slot `classNames` and `data-*` selectors with Tailwind, CSS modules, or plain CSS.

## Status

Early `0.x`. APIs may change. Packages are published under `@proteus-ui/*` (org-owned).

## Quick start

```bash
npm install @proteus-ui/core @proteus-ui/tokens @proteus-ui/theme-default
# or: yarn add @proteus-ui/core @proteus-ui/tokens @proteus-ui/theme-default
# or: pnpm add @proteus-ui/core @proteus-ui/tokens @proteus-ui/theme-default
```

```tsx
import "@proteus-ui/theme-default/theme.css";
import { Button, Field, SemanticMain, TextInput } from "@proteus-ui/core";

export function Example() {
  return (
    <SemanticMain>
      <Field label="Email">
        <TextInput type="email" name="email" />
      </Field>
      <Button intent="primary">Save</Button>
    </SemanticMain>
  );
}
```

### Composition notes

See **[RSC and compound-slot ergonomics](./docs/rsc-compound-slots.md)** for the full contract.

- **Flat exports** (`SemanticMain`, `SectionTitle`, `CardBody`, …) work from Server Components when used as leaves.
- **Compound slots** (`Section.Title`, `Card.Body`, …) must be composed in a Client Component so slot identity survives the RSC boundary.
- Prefer flat names from RSC pages; use the namespace form inside `"use client"` modules.

## What’s included

**Inputs & actions** — Button, TextInput, Textarea, Checkbox, Select, Field, SearchBar, NumberStepper, TimeInput, OtpInput  

**Structure** — Section, Card, LinkCard, PageFrame, CollapsibleSection, Toolbar, Semantic landmarks, Text  

**Feedback & overlays** — Badge, Dialog, Tooltip, Spinner, ErrorBoundary  

Plus hooks (`useControllableState`, `useInlineEdit`, `useModalCloseHandlers`, …) and an ESLint helper for compound-slot usage (`@proteus-ui/core/eslint`).

## Develop

This monorepo uses **pnpm** workspaces (`pnpm-workspace.yaml`). Contributors should use pnpm locally; app consumers can install with npm, yarn, or pnpm.

```bash
pnpm install
pnpm build
pnpm storybook    # http://localhost:6006
pnpm test
pnpm typecheck
pnpm lint
```

```
packages/
  core/            # React components + hooks
  tokens/          # design-token contract
  theme-default/   # default look
apps/
  storybook/       # component catalog
```

## Roadmap (short)

- Additional theme packages over the same core (`theme-*-like`)
- [Harden RSC + compound-slot ergonomics](./docs/rsc-compound-slots.md)
- Support for popular form libraries with smooth integration
- [Testing pyramid](./docs/roadmap/architecture-and-testing-specification.md#3-the-3-tier-testing-pyramid) as documented
- Cross-browser testing
- Responsiveness testing
- a11y audit
- Analyze and support loading states across components (e.g. Button spinner replacing label)
- Light / dark mode for the default theme
- Home / showcase page — aesthetic presentation of Proteus components (e.g. example dashboard), with a live theme-generator UI in the spirit of [Ant Design Theme Editor](https://ant.design/theme-editor/) that defaults to the page theme and updates the UI as controls change
- npm publish cutover beyond early `0.x`

## License

Private until a public license is declared. Treat as early / unstable.
