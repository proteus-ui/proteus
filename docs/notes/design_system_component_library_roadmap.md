---
type: research
project: flow-observer
status: archived
tags: [research, design-system]
created: 2025-12-01
---

# Design System & Component Library Roadmap (Unified Look & Feel)

## Goal

Build a **single, unified design system** and **single component library per framework** that enforces **one shared look & feel** across all products (e.g. Conductor / Visualizer and Maestro), regardless of runtime (Next.js app, Chrome extension).

This roadmap encodes a deliberate architectural constraint:

> **Visual cohesion is mandatory. Flexibility is contextual, not aesthetic.**

---

## Prerequisites

Read these documents **in order** before implementation:

| Doc | Title | Purpose |
|-----|-------|---------|
| 01 | Glossary & Domain Dictionary | Understand terminology |
| 02 | Methodologies & Architectures | Understand design system approaches |
| 03 | Comparison & Decision Framework | Evaluate tradeoffs |
| 04 | Design System vs Component Library | Understand separation of concerns |
| 05 | Separation & Adapter Architecture | Formalize architectural decisions |
| 06 | Theme Generator Parameters | Define generator inputs |
| 07 | Color Architecture Summary | Assess current state and problems |

---

## Chosen Architecture

Based on documented decisions (docs 02–05):

> **Code‑First, Token‑Driven, Generator‑Based Design System with Framework Adapters**

```
[ Brand / Theme Input ]
          ↓
[ Theme Generator ]        ← Design System (authoritative)
          ↓
[ Semantic Tokens ]
          ↓
[ Derived Artifacts ]      ← Adapters (CSS variables, JS maps)
          ↓
[ Component Libraries ]    ← Framework‑specific
          ↓
[ Application Code ]
```

**Core Principle** (from doc 04/05):

> **Design systems define what is possible.**
> **Component libraries define what is allowed.**

---

## Non‑Negotiable Constraints (Locked In)

1. **One visual identity** across all products
2. **One design system** (tokens + generator)
3. **One canonical theme** (initially light; dark later)
4. **One component library per framework** (not per product)
5. Products may differ only by **context**, not by design

**Allowed variation:**

- Runtime (web app vs Chrome extension)
- Density / compactness
- Feature availability

**Forbidden variation:**

- Product‑specific colors
- Product‑specific component styling
- Redefinition of semantics (e.g. what "primary" means)

---

## Phase 0: Foundations (Architecture Lock‑In)

**Reference:** docs 01, 02, 03

**Inputs considered:**

- Existing Conductor / Maestro codebases
- Historical differences identified as **accidental drift**, not intentional branding
- Current color assessment (doc 07): production‑grade palette with strong semantic discipline

**Decisions:**

- Single shared design language
- No product presets
- No per‑product theming
- CSS variables are **derived**, not first‑class (doc 03)

**Tasks:**

1. Finalize token taxonomy:
   - **Primitive tokens** — raw hex values, never imported by components
   - **Semantic tokens** — intent-based (`color.action.primary`, `color.feedback.error`)
   - **Component tokens** — optional, for complex domain UI (nodes, edges, toolbars)
2. Define and document usage rules (from doc 07):
   - No hex values outside `primitives.ts`
   - Components never import primitives
   - All text uses semantic text tokens
   - Colored backgrounds must use matching `on-*` text tokens
   - New colors require semantic justification
   - Visual similarity ≠ semantic equivalence
3. Decide accessibility baseline: **AA** (with option to enforce AAA)

**Decision Points:**

- Component tokens: include immediately for flow diagram UI
- Accessibility: AA minimum, AAA for critical text

---

## Phase 1: Theme Generator (Single Source of Visual Truth)

**Reference:** doc 06

**Purpose:** Encode the design language into deterministic rules.

**Generator Interface** (from doc 06):

```ts
export interface ThemeInput {
  brand: {
    primary: Color;
  };

  feedback: {
    success: Color;
    warning: Color;
    error: Color;
    info: Color;
  };

  neutral: {
    scale: NeutralScale;
  };

  mode: 'light' | 'dark';

  contrast: {
    textOnColor: 'AA' | 'AAA';
  };

  emphasis?: 'soft' | 'balanced' | 'strong';
}
```

**Tasks:**

1. Define `Color` and `NeutralScale` types
2. Implement `createTheme()` as a pure function
3. Define derivation rules:
   - Tints, shades, contrast adjustments
   - `on-*` color selection based on contrast policy
4. Map existing palette to generator inputs:
   | Existing Concept | Generator Input |
   |------------------|-----------------|
   | pink‑500 | `brand.primary` |
   | green scale | `feedback.success` |
   | blue scale | `feedback.info` |
   | red scale | `feedback.error` |
   | yellow scale | `feedback.warning` |
   | gray scale | `neutral.scale` |
5. Guarantee deterministic output
6. Output tokens as TypeScript objects

**Explicitly NOT supported (for now):**

- Product overrides
- Brand variants

**Decision Points:**

- Emphasis intensity: start with `balanced`, expose later
- CSS variable emission: build‑time for initial release

---

## Phase 2: Core Design System Package

**Reference:** docs 04, 05, 07

**Responsibilities:**

- Own all design decisions
- Remain framework‑agnostic
- Be the **source of truth**

**Folder Structure:**

```
design-system/
  ├─ tokens/
  │   ├─ primitives.ts      ← raw hex values
  │   ├─ semantic.ts        ← intent-based tokens
  │   ├─ components.ts      ← optional, domain-specific
  │   └─ index.ts
  ├─ theme/
  │   └─ createTheme.ts     ← pure generator function
  └─ index.ts
```

**Tasks:**

1. Implement token layers following structure above
2. Encode accessibility rules (`on-*` tokens)
3. Address problems from doc 07:
   - Decouple components from raw colors (`pink-500` → `color.action.primary`)
   - Separate semantic meanings (action vs selection vs focus)
   - Complete warning (yellow) scale
4. Export tokens in TypeScript form
5. Validate runtime compatibility (SSR‑safe, Chrome‑extension‑safe)

**Decision Points:**

- Runtime enforcement: TypeScript types only (no runtime validation initially)

---

## Phase 3: Adapter Layer (Derived Outputs)

**Reference:** docs 03, 04, 05

**Principle:** Adapters translate design decisions; they never define them.

**Adapter Rules** (from doc 05):

- Adapters are *derived*, never authoritative
- They must not introduce new semantics
- They must be replaceable

**Tasks:**

1. Generate derived artifacts:
   - CSS variables (`:root { --color-action-primary-bg: ... }`)
   - JS token maps (for runtime access)
2. Create component‑level CSS variable mappings:
   ```css
   :root {
     --button-primary-bg: var(--color-action-primary-bg);
     --button-primary-text: var(--color-action-primary-text);
   }
   ```
3. Support multiple runtimes (Next.js, Chrome extension)
4. Ensure adapters are replaceable and isolated

**Decision Points:**

- Build‑time CSS generation for initial release
- Runtime injection as future option

---

## Phase 4: Component Library (DX & Enforcement Layer)

**Reference:** docs 04, 05

**Goal:** Provide a clean, constrained API:

```tsx
<Button variant="primary" />
```

**Component Library Responsibilities** (from doc 04):

- Consume design system outputs
- Map tokens → actual UI
- Enforce allowed variants
- Provide excellent DX

**Component Library Non‑Responsibilities:**

- Choosing colors
- Defining spacing or typography systems
- Redefining semantics

**Tasks:**

1. Build one component library for React
2. Components:
   - Consume only semantic or component tokens
   - Expose limited, intentional variants
   - Enforce accessibility defaults (`aria` attributes, focus management)
3. Define variant types:
   ```ts
   type ButtonVariant = 'primary' | 'secondary' | 'danger';
   ```
4. No product‑specific components

**Density as the only axis of variation:**

```tsx
<Button variant="primary" density="compact" />
```

- `density="compact" | "regular"`

**Decision Points:**

- No custom styles allowed in v1
- Variant naming: semantic (`primary`, `danger`) not visual (`pink`, `red`)

---

## Phase 5: Adoption by Products

**Tasks:**

1. Migrate Conductor / Maestro to shared components
2. Remove direct color usage from apps:
   - Find all `pink-500`, `green-50` references
   - Replace with semantic token imports
3. Validate identical look & feel across products
4. Address layout constraints via density, not styling

**Validation Criteria:**

- No hex values in application code
- No primitive token imports
- Visual parity between products

---

## Phase 6: Enforcement & Governance

**Reference:** doc 04 (suggested next steps)

**Tasks:**

1. Linting rules:
   - Prevent primitive imports in apps (`no-restricted-imports`)
   - Enforce semantic token usage
   - Flag direct color values in JSX/CSS
2. Code review checklist:
   - [ ] Uses semantic tokens only
   - [ ] No hardcoded colors
   - [ ] Matches existing component patterns
3. Design system contribution rules:
   - New tokens require semantic justification
   - Changes must not break existing variants
4. Documentation for developers

**Decision Points:**

- Start with advisory linting, move to errors after migration

---

## Phase 7: Future‑Safe Extensions (Postponed by Design)

These are **explicitly deferred**, not forgotten:

- Dark mode (mode transformation in generator)
- White‑labeling (brand input parameterization)
- Brand variants
- Product presets
- Multi‑brand theming
- Spacing, typography, radius, elevation, motion tokens

They remain possible **because** the architecture is strict now.

---

## Guiding Principles (Read This Before Changing Anything)

From docs 04, 05:

1. **Cohesion beats flexibility**
2. **Design authority lives in the design system**
3. **Components constrain developers by design**
4. **Derived artifacts are not sources of truth**
5. **Visual divergence requires architectural justification**

From doc 06:

> If changing a value would surprise a product manager, it is **not** a parameter.
> If changing a value changes the entire personality of the UI, it **is** a parameter.

---

## Document Cross‑Reference

| Phase | Primary References |
|-------|-------------------|
| 0 | 01 Glossary, 02 Methodologies, 03 Decision Framework |
| 1 | 06 Theme Generator Parameters |
| 2 | 04 Architecture, 05 Separation, 07 Color Architecture |
| 3 | 03 CSS Variables, 04 Adapters, 05 Adapters |
| 4 | 04 Component Library, 05 Component Libraries |
| 5 | 07 Recommended Next Steps |
| 6 | 04 Natural Next Steps |
| 7 | 06 Future Extensions |

---

This roadmap represents a **deliberate, enterprise‑grade choice**: one design language, enforced consistently, with future flexibility preserved through abstraction—not shortcuts.
