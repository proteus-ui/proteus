---
type: research
project: flow-observer
status: archived
tags: [research, design-system]
created: 2025-12-01
---

# Design System (Code‑First) – Color Architecture Summary

## Context & Goal
You are consolidating multiple React + TypeScript projects under a shared **code‑first design system**, starting with **colors**. These projects include **Next.js web applications as well as a Chrome extension** (React + TypeScript, non‑Next runtime).

The intent is long‑term scalability, consistency, accessibility, and ease of theming (future brand changes, dark mode, white‑labeling), **independent of framework or runtime constraints**.

This document summarizes:
- What currently works well in your palette
- Identified issues and risks
- Best‑practice recommendations
- A concrete, implementation‑ready roadmap

---

## Current State Assessment

### Overall Quality
Your existing color work is **production‑grade** and significantly above average. It already resembles mature systems such as Material, Carbon, or Polaris in scope and rigor.

### Key Strengths

#### 1. Strong Semantic Discipline
Each hue has a consistent meaning:
- **Pink** → primary action, selection, focus
- **Green** → success, start, highlight
- **Blue** → info, finish, conditional
- **Purple** → branching, logic
- **Red** → error, danger
- **Gray** → neutral scaffolding

This lowers cognitive load for users and developers.

#### 2. Excellent Neutral Scale
Your grayscale supports:
- Text hierarchy
- Borders at multiple emphasis levels
- Disabled and subtle states

This prevents overuse of accent colors and aligns with professional UI systems.

#### 3. Comprehensive State Coverage
You consistently defined:
- Default / hover / selected
- Background / border / text / icon
- Component‑specific nuances (nodes, edges, tooltips, navigation)

Most systems fail here. Yours does not.

---

## Core Problems to Address

### 1. Over‑Coupling Components to Raw Colors

**Current issue**:
Components reference `pink‑500`, `green‑50`, etc. directly.

**Why this is dangerous**:
- Brand changes become expensive
- Dark mode is hard
- White‑labeling is nearly impossible

**Required fix**:
Introduce a strict abstraction layer:

```
Primitive → Semantic → Component
```

Components must never reference primitive colors directly.

---

### 2. Semantic Overload of Pink

Pink currently represents:
- Primary actions
- Selection
- Focus
- Search
- Navigation hover

This is acceptable **visually**, but risky **architecturally**.

**Best practice**:
Separate *meaning* even if values are currently identical.

Example:
- `color.action.primary`
- `color.state.selected`
- `color.state.focus`

This allows future divergence without refactoring components.

---

### 3. Accessibility Is Implicit, Not Enforced

You generally choose safe contrasts, but the system does not **guarantee** them.

**Missing elements**:
- Explicit contrast targets
- Text‑on‑color tokens (`on-*`)

**Recommendation**:
Adopt Material‑style patterns:
- `color.primary`
- `color.onPrimary`
- `color.surface`
- `color.onSurface`

This prevents accidental low‑contrast usage and simplifies dark mode.

---

### 4. Incomplete Semantic Coverage (Yellow)

Warning colors are referenced but not fully defined.

**Why this matters**:
Design systems must be:
- Explicit
- Predictable
- Self‑contained

**Action**:
Define a minimal yellow scale (`50 / 200 / 500 / 700 / 900`) even if usage is limited.

---

### 5. Component Definitions Are Too Color‑Specific

Many components define color values per variant instead of referencing shared semantics.

**Risk**:
- Duplication
- Inconsistent evolution

**Fix**:
Components should consume semantic tokens, not primitives.

Example:
```
badge.start.background = color.feedback.success.background
```

---

## Recommended Architecture (Code‑First)

### Folder Structure
```
design-system/
  ├─ tokens/
  │   ├─ primitives.ts
  │   ├─ semantic.ts
  │   ├─ components.ts
  │   └─ index.ts
  ├─ themes/
  │   ├─ light.ts
  │   └─ dark.ts
  └─ index.ts
```

---

### 1. Primitive Tokens
Raw color values only.

Rules:
- Hex values allowed
- Never imported into UI components

---

### 2. Semantic Tokens (Critical Layer)
Encode **intent**, not usage:
- Surface
- Text
- Action
- Feedback
- State

Rules:
- May reference primitives
- Never reference components

---

### 3. Component Tokens (Optional but Recommended)
Encapsulate complexity for domain‑specific UI (e.g. flow diagrams).

Rules:
- Reference semantic tokens only
- Components consume only component tokens

---

## Usage Rules (Non‑Negotiable)
Add these as a README in the design system:

1. No hex values outside `primitives.ts`
2. Components never import primitives
3. All text uses semantic text tokens
4. Colored backgrounds must use matching `on-*` text tokens
5. New colors require semantic justification
6. Visual similarity ≠ semantic equivalence

These rules prevent entropy as the system grows.

---

## Dark Mode Readiness
Your palette is already ~90% compatible.

Once semantic tokens exist:
- Dark mode is a new semantic mapping
- Components remain unchanged

This validates your abstraction and exposes weak contrast decisions early.

---

## Recommended Next Steps

### Short Term (Immediate)
1. Extract **primitives** from existing projects
2. Create **semantic tokens** mirroring current meanings
3. Replace direct color usage in components with semantic tokens

### Medium Term
4. Introduce **component tokens** for complex UI (nodes, edges, toolbars)
5. Add `on-*` tokens and verify contrast ratios
6. Define a complete warning (yellow) scale

### Long Term
7. Add dark theme implementation
8. Automate token export (CSS variables)
9. Extend system to spacing, typography, radius, elevation, motion

---

## Final Assessment

You do **not** have a color‑taste problem.
You have a **structuring problem**, and it is solvable.

Once semantic tokens and strict usage rules are in place, you will have:
- A scalable, multi‑project design system
- Minimal refactor cost over time
- A professional, maintainable UI foundation

This is the correct direction.

