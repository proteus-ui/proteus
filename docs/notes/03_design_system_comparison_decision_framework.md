---
type: research
project: flow-observer
status: archived
tags: [research, design-system]
created: 2025-12-01
---

# Design System Comparison & Decision Framework

This document provides **side-by-side comparisons**, **pros/cons**, and a **practical framework** for selecting a design-system architecture.

---

## Comparative Overview

| Dimension | Primitive | Semantic Tokens | Component-Driven | Theme Generator |
|---------|----------|-----------------|------------------|-----------------|
| Scalability | Low | High | Medium | Very High |
| Consistency | Low | High | Very High | Very High |
| Flexibility | Very High | Medium | Low | Medium |
| Accessibility | Manual | Enforced | Enforced | Enforced |
| Theming | Hard | Easy | Medium | Excellent |
| Framework Lock | None | Low | High | Low |

---

## CSS Variables: First-Class vs Derived

### First-Class CSS Variables
- CSS is the source of truth
- Tokens are defined in stylesheets

**Pros**
- Framework agnostic
- Simple runtime theming

**Cons**
- No typing
- Weak enforcement
- Easy to drift

---

### Derived CSS Variables
- TypeScript is authoritative
- CSS variables are generated

**Pros**
- Strong typing
- Clear ownership
- Works with generators

**Cons**
- Requires tooling or runtime injection

---

## Decision Framework

Answer these questions:

1. Do you need multiple brands or themes?
2. Do components need to survive visual redesigns?
3. Is TypeScript your primary integration surface?
4. Do you need to support multiple runtimes?
5. Do you want enforcement or guidelines?

If most answers are **yes**, prefer:
- Semantic tokens
- Theme generator
- Derived CSS variables

---

## Recommended Architecture Pattern

```
Theme Input
   ↓
createTheme()
   ↓
Semantic Tokens
   ↓
Adapters (CSS vars, JS, etc.)
   ↓
UI
```

This maximizes longevity and control.

