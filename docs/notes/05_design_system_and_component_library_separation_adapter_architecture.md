---
type: research
project: flow-observer
status: archived
tags: [research, design-system]
created: 2025-12-01
---

# Design System and Component Library
## Separation of Concerns, Adapters, and Multi‑Framework Strategy

This document captures the **final architectural decision** reached in the discussion and formalizes it as a reference you can keep alongside the codebase.

It explains:
- Why a design system and a component library must be separate
- How generator‑based, token‑driven systems coexist with component‑driven DX
- How adapters bridge the two without leaking authority
- How this enables multi‑framework support (React, Angular, Vue, Svelte)

---

## Core Principle

> **Design systems define what is possible.**  
> **Component libraries define what is allowed.**

Conflating these responsibilities leads to semantic drift, loss of design authority, and poor scalability.

---

## Layered Architecture Overview

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

Each layer has a single responsibility and a clear owner.

---

## Design System (Core)

**Characteristics**
- Code‑first
- Token‑driven
- Generator‑based
- Framework‑agnostic

**Owns**
- Semantic meaning (e.g. `color.action.primary`)
- Accessibility guarantees
- Theme logic and derivation rules
- Brand expression

**Does NOT**
- Render UI
- Expose components
- Know about JSX, DOM, or frameworks

The design system is the **source of truth**.

---

## Theme Generator

A pure function:

```ts
createTheme(input) → semantic tokens
```

**Purpose**
- Parameterize visual identity
- Enable theming, dark mode, white‑labeling
- Centralize design decisions

This is where design intent is encoded into deterministic rules.

---

## Adapters (Translation Layer)

Adapters translate semantic tokens into consumable outputs.

Examples:
- CSS variables
- JavaScript token objects
- Utility mappings

**Rules**
- Adapters are *derived*, never authoritative
- They must not introduce new semantics
- They must be replaceable

This is why **CSS variables are derived, not first‑class**.

---

## Component Libraries (Framework‑Specific)

This layer provides the desired DX:

```tsx
<Button variant="primary" />
```

**Responsibilities**
- Consume design system outputs
- Enforce allowed variants
- Prevent ad‑hoc styling
- Provide consistent, ergonomic APIs

**Non‑Responsibilities**
- Choosing colors
- Defining spacing or typography systems
- Redefining semantics

Component libraries are intentionally **restrictive**.

---

## Why This Enforces Design Authority

- Designers control tokens and generators
- Engineers consume variants
- Visual decisions cannot be overridden accidentally

This creates intentional power asymmetry that scales across teams and products.

---

## Multi‑Framework Support

A single design system can support multiple frameworks.

| Layer | Shared | Per Framework |
|-----|------|---------------|
| Design system | ✅ | — |
| Theme generator | ✅ | — |
| Tokens | ✅ | — |
| CSS variables | ✅ | — |
| Component libraries | — | React / Vue / Angular / Svelte |

Only the adapter + component layers change.

---

## Naming the Architecture

Accurate descriptions:
- **Code‑First, Token‑Driven Design System**
- **Generator‑Based Semantic Token Architecture**
- **Design System with Framework Adapters**

Any of these are correct and defensible.

---

## Final Assessment

This architecture is:
- Scalable
- Enforceable
- Multi‑framework‑ready
- Aligned with mature enterprise systems

You are building a **UI foundation**, not a UI kit.

