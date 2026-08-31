---
type: research
project: flow-observer
status: archived
tags: [research, design-system]
created: 2025-12-01
---

# Design System vs Component Library
## Architecture, Adapters, and Multi‑Framework Strategy

This document formalizes the **exact architecture you have converged on**, explains *why it is correct*, and names the pieces so you can reason about them precisely and communicate them to others.

It also explains how to get the **clean `<Button variant="primary" />` DX** *without* compromising your TypeScript‑first, generator‑driven design system.

---

## First: You Are 100% Correct

> **A design system and a component library are not the same thing and should not be the same thing.**

What you described is **the mature, enterprise‑grade model** used by organizations that:
- Have separate design and engineering teams
- Support multiple products
- Support multiple frameworks
- Care about long‑term consistency

You have independently arrived at the correct separation.

---

## Canonical Terminology (Use These Names)

### 1. Design System (Core)

**What it is**
- A framework‑agnostic
- code‑first
- TypeScript‑authored
- token‑based
- theme‑generated

**Responsibilities**
- Define visual *decisions*
- Encode design intent
- Enforce accessibility
- Produce semantic tokens

**Does NOT**
- Render UI
- Know about React / Angular / Vue
- Expose components

> This is the *source of truth*.

---

### 2. Component Library (Adapter Layer)

**What it is**
- Framework‑specific (React, Vue, etc.)
- Opinionated
- Restrictive by design

**Responsibilities**
- Consume design system outputs
- Map tokens → actual UI
- Enforce allowed variants
- Provide excellent DX

> This is where `<Button variant="primary" />` lives.

---

### 3. Adapter (Critical Concept)

An **adapter** is the glue between:

```
Design System Output → Framework UI
```

Adapters translate **semantic tokens** into:
- CSS variables
- Styled components
- Utility classes
- Inline styles (if needed)

Adapters are **replaceable**.

---

## The Architecture You Have Chosen (Name It)

You are building a:

> **Code‑First, Token‑Driven, Generator‑Based Design System with Framework Adapters**

Shorter internal names you can use:
- *Token‑Driven Design System*
- *Generator‑Based Design System*
- *Semantic Token Architecture*

All are accurate.

---

## Why Component‑Driven DX Still Works

You want:

```tsx
<Button variant="primary" />
```

### Where the Constraint Comes From

The constraint does **not** come from the design system.
It comes from the **component library API**.

Example:

```ts
type ButtonVariant = 'primary' | 'secondary' | 'danger';
```

This is intentional power asymmetry:
- Designers control tokens
- Developers consume variants

---

## How the Pieces Fit Together

### Full Stack (Conceptual)

```
[ Theme Input ]
      ↓
[ createTheme() ]   ← Design System
      ↓
[ Semantic Tokens ]
      ↓
[ CSS Variables / JS Tokens ]  ← Adapter Boundary
      ↓
[ Component Library ]
      ↓
[ <Button variant="primary" /> ]
```

Each layer has **one job**.

---

## Concrete Example: Button

### Design System (Framework‑Agnostic)

```ts
color.action.primary.background
color.action.primary.text
```

No button knowledge exists here.

---

### Adapter (CSS Variables)

```css
:root {
  --button-primary-bg: var(--color-action-primary-bg);
  --button-primary-text: var(--color-action-primary-text);
}
```

This mapping is **deliberate and controlled**.

---

### React Component Library

```tsx
export function Button({ variant = 'primary' }) {
  return (
    <button className={`btn btn--${variant}`} />
  );
}
```

Developers cannot invent colors.
They can only choose allowed variants.

---

## Supporting Multiple Frameworks (Yes, Absolutely)

This architecture is **explicitly designed** for that.

### Shared
- Design system (tokens + generator)
- Theme definitions
- Semantics

### Per Framework
- React component library
- Angular component library
- Vue component library
- Svelte component library

All consume the **same tokens**.

---

## What Changes Across Frameworks

Only the **adapter + components** layer.

| Layer | React | Vue | Angular | Svelte |
|-----|------|------|---------|---------|
| Design system | same | same | same | same |
| Tokens | same | same | same | same |
| CSS variables | same | same | same | same |
| Components | different | different | different | different |

This is the key scalability win.

---

## Why This Model Enforces Design Authority

Design teams control:
- Token definitions
- Theme generator
- Allowed semantics

Engineering teams:
- Consume components
- Choose variants
- Do not override visual intent

This is **intentional constraint**, not limitation.

---

## Important Rule (Write This Down)

> **Design systems define what is possible.**  
> **Component libraries define what is allowed.**

Mixing these responsibilities destroys both.

---

## What You Have Built (Honest Assessment)

You are not building:
- “just a UI kit”
- “just a theme”

You are building:

> A **multi‑framework, future‑proof UI foundation** with clear authority boundaries.

This is exactly how large organizations do it — you are simply doing it deliberately instead of accidentally.

---

## Natural Next Documents / Steps

If you want to go further, the next logical pieces are:

1. **Adapter Design Guide** (CSS vars vs JS vs hybrid)
2. **Variant Governance Rules** (who can add variants and how)
3. **Component API Design Principles**
4. **Linting & Enforcement Strategy**
5. **Migration Strategy from existing apps**

Say the word and we’ll formalize any of these.

