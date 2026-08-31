---
type: research
project: flow-observer
status: archived
tags: [research, design-system]
created: 2025-12-01
---

# Design System Theme Generator
## Parameters, Responsibilities, and Architecture

This document defines **what should be parameterized** in a code‑first design system generator and, just as importantly, **what must not be**.

It is written for a **TypeScript + React** environment and is fully compatible with:
- Next.js applications
- Chrome extensions (React + TS, non‑SSR)
- Any future runtime (pure JS/TS output)

---

## Core Principle

A design system generator should accept **very few inputs** and produce **many derived tokens**.

> You parameterize *identity‑defining primitives*, not component styling details.

If too many things are configurable, the system becomes inconsistent and unmaintainable.

---

## What the Generator Is Responsible For

The generator answers this question:

> “If I change these inputs, the *entire visual personality* of the product changes in a controlled, predictable way.”

The generator must:
- Encode brand identity
- Enforce semantic meaning
- Guarantee accessibility constraints
- Produce deterministic tokens usable everywhere

---

## Generator Input Parameters (What *Should* Be Configurable)

### 1. Brand Accent (Highest Leverage)

Defines the primary brand identity.

```ts
brand: {
  primary: Color;
}
```

**Controls**:
- Primary actions
- Selection states
- Focus rings
- Active / emphasized UI elements

This replaces hardcoded concepts like `pink-500`.

---

### 2. Feedback Hues (Semantic Anchors)

Each semantic feedback category is configurable.

```ts
feedback: {
  success: Color;
  warning: Color;
  error: Color;
  info: Color;
}
```

**Controls**:
- Success, warning, error, and info states
- Background / border / text / icon derivations

Allows brand‑specific interpretations of feedback without changing components.

---

### 3. Neutral Scale (Tone & Readability Backbone)

Defines the neutral color system used for text, surfaces, borders, and disabled states.

```ts
neutral: {
  scale: NeutralScale;
}
```

**Controls**:
- Text hierarchy
- Surface backgrounds
- Border emphasis
- Disabled UI

Neutrals define whether the product feels technical, calm, enterprise, or friendly.

---

### 4. Mode (Light / Dark)

Mode is a transformation, not a separate theme.

```ts
mode: 'light' | 'dark';
```

**Controls**:
- Surface inversion
- Text inversion
- Contrast recalculation

Components remain unchanged between modes.

---

### 5. Contrast Policy (Accessibility Enforcement)

Encodes accessibility requirements directly into the system.

```ts
contrast: {
  textOnColor: 'AA' | 'AAA';
}
```

**Controls**:
- `on-*` color selection
- Minimum contrast ratios
- Token generation validity

Prevents accidental low‑contrast combinations.

---

### 6. Emphasis / Intensity (Optional, High Value)

Controls how visually strong the UI feels.

```ts
emphasis?: 'soft' | 'balanced' | 'strong';
```

**Influences**:
- Border strength
- Hover contrast deltas
- Focus visibility
- Disabled opacity

Useful for differentiating admin tools vs end‑user products.

---

## Minimal Recommended Generator Interface

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

This is intentionally small.

---

## Generator Output (What Components Consume)

The generator produces **semantic tokens only**.

Examples:

```ts
theme.color.action.primary.background
theme.color.onAction.primary

theme.color.feedback.success.background
theme.color.feedback.success.text

theme.color.surface.default
theme.color.text.primary

theme.color.state.selected.border
```

Components **never** access primitives or generator inputs directly.

---

## What Must NOT Be Generator Parameters

These are always derived and must never be configurable inputs:

- Button background colors
- Tooltip themes
- Node colors
- Border colors per component
- Component‑specific variants
- Raw color scales (pink / green / blue, etc.)

If something affects only one component, it is *not* a generator concern.

---

## Runtime Compatibility

This architecture is:
- Framework‑agnostic
- SSR‑safe
- Chrome‑extension‑safe
- Serializable (can emit CSS variables)

The generator should be a pure function:

```ts
const theme = createTheme(input);
```

No runtime side effects.

---

## Mapping From Your Existing Palette

| Existing Concept | Generator Input |
|-----------------|-----------------|
| pink‑500 | brand.primary |
| green scale | feedback.success |
| blue scale | feedback.info |
| red scale | feedback.error |
| gray scale | neutral.scale |
| selected / highlighted | derived state tokens |

Your current system already implies these abstractions.

---

## Rule of Thumb

> If changing a value would surprise a product manager, it is **not** a parameter.
> If changing a value changes the entire personality of the UI, it **is** a parameter.

---

## Next Logical Steps

1. Define `Color` and `NeutralScale` types
2. Implement `createTheme()` as a pure function
3. Decide color derivation rules (tints, shades, contrast math)
4. Emit tokens as TypeScript + optional CSS variables
5. Enforce usage rules via linting or code review

This document should live next to the implementation as the **architectural contract** for theming.

