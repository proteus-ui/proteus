---
type: research
project: flow-observer
status: archived
tags: [research, design-system]
created: 2025-12-01
---

# Design System Glossary

This document defines **domain-specific terminology** used throughout the design-system architecture discussion.

---

## Design System
A centralized set of rules, tokens, and components that govern UI decisions across products.

---

## Token
An atomic, named design value.

Examples:
- Color token
- Spacing token
- Typography token

---

## Primitive Token
A raw, appearance-based value with no semantic meaning.

Example:
```ts
pink500 = '#ec4899'
```

---

## Semantic Token
A token that expresses *intent* rather than appearance.

Example:
```ts
color.action.primary
```

---

## Component Token
A token scoped to a specific component.

Example:
```ts
button.primary.background
```

---

## Theme
A concrete realization of all tokens for a given context (brand, mode, contrast).

---

## Theme Generator
A function that produces a full theme from a small identity input.

Example:
```ts
createTheme(input)
```

---

## Source of Truth
The authoritative layer where decisions are made.

---

## First-Class Citizen
An entity that owns meaning and authority within the system.

---

## Derived Artifact
An output generated from the source of truth that must not introduce new meaning.

---

## CSS Variables (Custom Properties)
Runtime-resolved CSS values prefixed with `--`.

---

## Semantic Drift
Gradual erosion of meaning when tokens are reused inconsistently.

---

## Enforcement
Mechanisms that prevent invalid usage (typing, linting, runtime checks).

---

## White-Labeling
Supporting multiple brands using the same underlying system.

---

## Runtime vs Build-Time
When token generation or application occurs.

---

## Framework Coupling
Dependency on a specific UI framework or runtime.

