---
type: research
project: flow-observer
status: archived
tags: [research, design-system]
created: 2025-12-01
---

# Design System Methodologies & Architectures

This document describes **the major methodologies and architectural styles used to build design systems**, independent of tools or frameworks.

It focuses on *where authority lives*, *how change propagates*, and *what tradeoffs each approach makes*.

---

## What a Design System Is (Architectural Definition)

A design system is a **central authority for UI decisions** that:
- Encodes visual and interaction rules
- Enforces consistency
- Allows controlled evolution over time

It is not synonymous with:
- A component library
- A color palette
- A Figma file

---

## Core Architectural Axes

Every design system exists as a position on these axes:

### 1. Source of Truth
- Design-first (Figma)
- Code-first (TypeScript / JS)
- Hybrid (tokens as interface)

### 2. Abstraction Level
- Primitives (raw values)
- Semantic tokens (intent-based)
- Component tokens (pre-mapped)

### 3. Distribution Model
- Shared package
- Generated artifacts
- Runtime configuration
- CSS-only delivery

### 4. Enforcement Strength
- Conventions only
- Typed contracts
- Runtime validation

---

## Major Methodologies

### 1. Primitive-Only Systems

**Description**
- Expose raw tokens only (colors, spacing, typography)
- Composition is left to product teams

**Characteristics**
- Utility-first
- Minimal abstraction
- No semantic guarantees

**Strengths**
- Maximum flexibility
- Low entry cost

**Weaknesses**
- Inconsistency at scale
- Accessibility is manual
- Semantic drift

---

### 2. Semantic Token Systems

**Description**
- Tokens represent *intent*, not appearance
- Components consume meaning, not values

**Characteristics**
- `color.action.primary`
- `color.feedback.error`
- `color.surface.elevated`

**Strengths**
- Excellent scalability
- Stable components
- Natural theming

**Weaknesses**
- Requires upfront design
- Semantics must be maintained

---

### 3. Component-Driven Systems

**Description**
- Components are the primary API
- Styling decisions are encapsulated

**Characteristics**
- Variant-based APIs
- Opinionated visuals

**Strengths**
- Fast adoption
- High consistency

**Weaknesses**
- Hard to customize deeply
- Framework coupling

---

### 4. Theme Generator Systems

**Description**
- Small set of identity inputs
- Full semantic system is derived

**Characteristics**
- Brand-driven
- Deterministic output

**Strengths**
- White-label friendly
- Strong enforcement

**Weaknesses**
- High initial complexity
- Requires color math expertise

---

## Architectural Styles in Code

### Static Tokens
- Build-time constants

### Runtime Theme Objects
- `createTheme(input)`

### CSS Variable-Based Systems
- Tokens exposed as CSS custom properties

### Generated Artifacts
- Tokens emitted via tooling

---

## Key Insight

> Methodology defines *what* you expose. Architecture defines *how* it flows.

Both must align.

