# RSC and compound-slot ergonomics

Status: **current limitation** (supported workarounds below). Hardening is on the [README roadmap](../README.md#roadmap-short).

## Problem

Compound parents (`Section`, `Card`, `Dialog`, `CollapsibleSection`, …) collect children with `collectNamedSlots` / related helpers in `@proteus-ui/core`. Matching prefers **component identity** (`child.type === Section.Title`), then falls back to `$$proteusSlot` / `displayName`.

In the **App Router**, a Server Component that renders:

```tsx
<Section>
  <SectionTitle>…</SectionTitle>
  <SectionBody>…</SectionBody>
</Section>
```

passes those children across the React Flight boundary as **client references**. On the client, `child.type` is no longer the same function object as the in-module `SectionTitle`, and the reference often lacks `$$proteusSlot` / `displayName`. Slot matching fails:

```text
Section direct children must be slot elements (Title, Body). Invalid at index 0.
```

Related footguns:

| Pattern | Symptom |
| --- | --- |
| Barrel-level `"use client"` on `core` index | Namespace objects (`Semantic.Nav`) can become opaque / undefined in RSC |
| Namespace from RSC (`Semantic.Main`, `Text.Span`) | Unreliable across RSC ↔ client; prefer flat exports |
| Flat slot children under a compound parent in RSC | Identity mismatch → runtime throw (above) |

## Supported patterns (today)

### 1. Compose compounds inside a Client Component (preferred)

Keep data fetching in the Server Component; pass serializable props into a `"use client"` wrapper that owns the compound tree:

```tsx
// OffersSection.tsx
"use client";

import { Section } from "@proteus-ui/core";

export function OffersSection({ count }: { count: number }) {
  return (
    <Section>
      <Section.Title>Offers ({count})</Section.Title>
      <Section.Body>{/* … */}</Section.Body>
    </Section>
  );
}
```

Inside a client module, `Section.Title` / `Section.Body` (or co-imported `SectionTitle` / `SectionBody`) share the same module graph, so identity matching works.

### 2. Flat exports for non-compound leaves in RSC

Landmarks and text are fine as flat named exports from Server Components:

```tsx
import { SemanticMain, SemanticHeader, TextH1 } from "@proteus-ui/core";
```

Do **not** rely on `Semantic.Main` / `Text.H1` from RSC.

### 3. Rule of thumb

| Surface | Use |
| --- | --- |
| Server Component page / layout | Flat exports; no compound parent↔slot children |
| Client Component | Compound namespaces (`Section.Title`) or flat slots co-imported with the parent |

## What “harden RSC + compound-slot ergonomics” means

Product work to remove the footgun, not a one-line fix:

1. **Documented contract** — this doc + Storybook examples of the supported RSC recipe (and a called-out anti-pattern).
2. **Slot matching that survives Flight** — resolve slots via stable `$$proteusSlot` (or equivalent) on client references, not only `===`.
3. **Identity-free API** (optional) — props / render props (`title`, `body`) so RSC never passes slot *components* as children.
4. **Lint guardrails** — extend `@proteus-ui/core/eslint` (or docs-only) to flag compound composition in Server Components.
5. **Barrel / `"use client"` policy** — keep directives on interactive modules; avoid reintroducing barrel-wide `"use client"` that breaks namespaces.

Until that lands, treat **client-side compound composition** as the supported path.

## See also

- `packages/core/src/utils/compound/utils.ts` — `collectNamedSlots` / `matchSlot`
- `packages/core/eslint/compound-slots.js` — static slot child checks (does not yet cover RSC)
- Consumer incident: job-inbox production error fixed by wrapping `Section` in a client `OffersSection`
