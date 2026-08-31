---
type: research
project: flow-observer
status: archived
tags: [research, design-system]
created: 2025-12-01
---

# Design System Extraction Guide (Visualizer / Conductor)

This document lists **design tokens, components, styles, animations, and UI elements that exist today** in the Visualizer project and should be extracted into a future **code-first, token-driven, generator-based design system** and a separate **component library**.

It intentionally mirrors the structure and rigor of `docs/design-system/_MAESTRO-DESIGN_SYSTEM_EXTRACTION.md`.

## Architecture Alignment

This extraction guide aligns with:
- `design_system_and_component_library_separation_adapter_architecture.md`
- `design_system_theme_generator_parameters_architecture.md`
- `design_system_vs_component_library_architecture_adapters.md`
- `design_system_color_architecture_summary_next_steps.md`

### Token Hierarchy

Following the established architecture, tokens are organized in three layers:
1. **Primitive Tokens** — raw values (hex colors, pixel values, etc.)
2. **Semantic Tokens** — intent-based tokens (`color.action.primary`, `spacing.md`)
3. **Component Tokens** — component-specific mappings (optional; recommended for diagram UI)

**Critical rule**: components must never reference primitive tokens directly.

## Table of Contents
1. [Primitive Tokens](#primitive-tokens)
2. [Semantic Token Mapping](#semantic-token-mapping)
3. [Component Tokens](#component-tokens)
4. [Theme Generator Inputs](#theme-generator-inputs)
5. [Components](#components)
6. [Animations](#animations)
7. [Icons](#icons)
8. [Typography](#typography)
9. [Layout & Spacing](#layout--spacing)
10. [Effects & Shadows](#effects--shadows)
11. [CSS Variables (Derived)](#css-variables-derived)
12. [Files to Extract](#files-to-extract)

---

## Primitive Tokens

### Color Primitives

This project has two primary sources of literal color primitives:
- `app/components/flow-diagram/utils/theme.ts` (`FLOW_THEME`)
- `app/app/globals.css`

#### Brand / Accent (Observed)

Primary pink/magenta and related shades:
- `#ec4899` (global `--pink-primary`; React Flow selected edges)
- `#db2777` (global `--pink-dark`)
- `#be185d`
- `#fce7f3` (global `--pink-light`)
- `#fbcfe8`
- `#f9a8d4`
- `#f472b6`

Purple:
- `#a855f7` (global `--purple`)
- `#9333ea`
- `#6b21a8`
- `#581c87`
- `#c084fc`
- `#d8b4fe`
- `#e9d5ff`
- `#f3e8ff`
- `#faf5ff`
- `#c4b5fd`

Teal:
- `#14b8a6` (global `--teal`)

#### Feedback / States (Observed)

Success / highlight green:
- `#10b981`
- `#059669`
- `#047857`
- `#064e3b`
- `#065f46`
- `#6ee7b7`
- `#86efac`
- `#a7f3d0`
- `#d1fae5`

Info / finish blue:
- `#3b82f6`
- `#2563eb`
- `#1e40af`
- `#60a5fa`
- `#93c5fd`
- `#bfdbfe`
- `#dbeafe`
- `#eff6ff`

Warning / orange-yellow:
- `#f59e0b`
- `#92400e`
- `#fde68a`
- `#fef3c7`

Error / danger red:
- `#ef4444`
- `#dc2626`
- `#b91c1c`
- `#991b1b`
- `#f87171`
- `#fca5a5`
- `#fecaca`
- `#fee2e2`
- `#fef2f2`

#### Neutral Scale (Observed)

From `FLOW_THEME` and `globals.css`:
- `#ffffff`
- `#f9fafb`
- `#f3f4f6`
- `#e5e7eb`
- `#d1d5db`
- `#9ca3af`
- `#6b7280` (global `--gray-text`)
- `#4b5563`
- `#374151`
- `#111827`
- `#2d2d2d` (global `--foreground`)

---

### Spacing Primitives

Explicit pixel values are present via inline styles and Tailwind arbitrary values:

`0px`, `1px`, `2px`, `3px`, `4px`, `5px`, `6px`, `7px`, `8px`, `9px`, `10px`, `11px`, `12px`, `13px`, `14px`, `15px`, `16px`, `18px`, `20px`, `24px`, `25px`, `32px`, `36px`, `40px`, `44px`, `50px`, `54px`, `64px`, `80px`, `85px`, `100px`, `120px`, `150px`, `200px`, `220px`, `280px`, `300px`, `326px`, `350px`, `400px`, `420px`, `500px`, `600px`, `800px`, `925px`, `999px`, `1200px`

Notable usages:
- Popover sizing: `maxWidth: "400px"` in `app/components/flow-diagram/InfoPopup.tsx`
- Modal widths: `w-[500px]` and `w-[600px]` (`ConfirmationModal`, `StepDetailModal`, `BranchDetailModal`)
- Tooltip arrow: `width={8}` `height={4}` in `app/components/Tooltip.tsx`

### Border Radius Primitives

Explicit `rem` values in `app/app/globals.css`:
- `0.375rem` (`.badge-pink`)
- `0.5rem` (`.card`)

### Typography Primitives

From `app/app/globals.css`:
- Font family:
  - `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif`
- Font sizes:
  - `0.75rem` (`.badge-pink`)
- Font weights:
  - `600` (`.badge-pink`)

### Shadow Primitives

From `app/app/globals.css`:
- `0 4px 12px rgba(236, 72, 153, 0.3)` (`.btn-pink:hover`)
- `0 1px 3px rgba(0, 0, 0, 0.1)` (`.card`)

From `FLOW_THEME`:
- `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- `0 2px 4px rgba(0,0,0,0.2)`
- `0 10px 15px -3px rgba(0, 0, 0, 0.1)`
- Highlight glows and drop-shadows (green)

### Transition Primitives

From `app/app/globals.css`:
- `transition: all 0.2s` (`.btn-pink`)
- `transition: transform 0.2s` (`.collapsible-arrow`)

From `app/components/Tooltip.tsx`:
- `animationDuration: '400ms'`
- `animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'`

### Z-Index Primitives

Observed z-index classes:
- `z-10`, `z-20`, `z-40`, `z-50`, `z-100`, `z-9999`
- `z-[9999]` used by:
  - `app/components/ConfirmationModal.tsx`
  - `app/components/flow-diagram/StepDetailModal.tsx`
  - `app/components/flow-diagram/BranchDetailModal.tsx`

---

## Semantic Token Mapping

Observed-driven semantic assignments:

```ts
color.action.primary = #ec4899
color.action.primary.hover = #db2777
color.action.primary.active = #be185d

color.feedback.success = #10b981
color.feedback.info = #3b82f6
color.feedback.warning = #f59e0b
color.feedback.error = #ef4444

color.surface.default = #ffffff
color.surface.subtle = #f9fafb
color.surface.muted = #f3f4f6

color.text.primary = #111827
color.text.secondary = #374151
color.text.muted = #6b7280

color.border.default = #e5e7eb
color.border.subtle = #d1d5db
```

---

## Component Tokens

Recommended (diagram UI already has domain tokens via `FLOW_THEME`):

```ts
button.primary.background = color.action.primary
button.primary.backgroundHover = color.action.primary.hover

tooltip.surface = color.surface.default
tooltip.border = color.border.default

modal.surface = color.surface.default
modal.border = color.border.default
```

---

## Theme Generator Inputs

Observed palette anchors for generator inputs:

```ts
brand.primary = #ec4899
feedback.success = #10b981
feedback.info = #3b82f6
feedback.warning = #f59e0b
feedback.error = #ef4444
```

---

## Components

### Toolbar Icon Buttons (`app/components/flow-diagram/ToolbarButton.tsx`)

- Variants: `"info" | "highlight" | "export" | "add" | "delete" | "legend" | "visibility" | "search" | "layout"`
- Size: `w-6 h-6` (icon: `w-4 h-4`)
- States: default/hover/active/disabled
- Tokens passed via CSS variables: `--toolbar-*`

### Tooltip (`app/components/Tooltip.tsx`)

- Radix Tooltip
- Delay: `400ms` uncontrolled, `0ms` controlled
- Container: `z-50 ... bg-white border border-gray-200 rounded-lg shadow-lg text-xs`
- Arrow: `8×4`

### Badge (`app/components/Badge.tsx`)

- Variants: `progress`, `decision`, `background`, `type`, `required`, `validation`
- Some variants include tooltip content

### Confirmation Modal (`app/components/ConfirmationModal.tsx`)

- Variants: `danger | default`
- Z: `z-[9999]`
- Width: `w-[500px]`, `max-w-[90vw]`
- Escape closes; no overlay element

### Step Detail Modal (`app/components/flow-diagram/StepDetailModal.tsx`)

- Z: `z-[9999]`
- Width: `w-[600px]`
- Height: `max-h-[80vh]`
- Draggable

### Branch Detail Modal (`app/components/flow-diagram/BranchDetailModal.tsx`)

- Z: `z-[9999]`
- Width: `w-[600px]`
- Height: `max-h-[80vh]`
- Draggable; close icon button

### Edge Action Modal (`app/components/flow-diagram/EdgeActionModal.tsx`)

- Escape closes; outside click closes (unless dragging)
- Autosave debounce: `1000ms`
- Modal width constant: `600`

### Info Popup (`app/components/flow-diagram/InfoPopup.tsx`)

- Position: `absolute top-10 left-10 z-40`
- `maxWidth: "400px"`
- Escape/outside click closes

### Collapsible Section (`app/components/flow-diagram/CollapsibleSection.tsx`)

- Expanded state renders body
- Chevron rotates with `transition-transform`

### History Panel (`app/components/flow-diagram/HistoryPanel.tsx`)

- Position: `absolute bottom-2 right-2 z-40`
- Expand/collapse UX; undo/redo actions

---

## Animations

No `@keyframes` definitions found in `app/`.

Observed motion:
- CSS transitions in `globals.css` (`0.2s`)
- Tooltip animation settings (400ms cubic-bezier)
- Tailwind `transition-*` utilities

---

## Icons

Icons are inline SVGs, commonly:
- `viewBox="0 0 24 24"`, `stroke="currentColor"`, `strokeWidth={2}`

---

## Typography

Global font-family defined in `app/app/globals.css`. Most sizing/weights are via Tailwind utilities.

---

## Layout & Spacing

- Header: left title/version; right side controls
- Diagram toolbar: `absolute top-2 left-2`
- Modals: fixed, draggable, `z-[9999]`, `max-h-[80vh]`

---

## Effects & Shadows

- Gradient title (`.gradient-text`): `#ec4899 → #a855f7 → #14b8a6`
- Pink button hover glow: `0 4px 12px rgba(236, 72, 153, 0.3)`
- Diagram highlight glows in `FLOW_THEME`

---

## CSS Variables (Derived)

Defined in `app/app/globals.css` (`:root`): background/foreground and brand accents.

---

## Files to Extract

- `app/components/flow-diagram/utils/theme.ts`
- `app/app/globals.css`
- `app/components/flow-diagram/ToolbarButton.tsx`
- `app/components/Tooltip.tsx`
- `app/components/Badge.tsx`
- `app/components/ConfirmationModal.tsx`
- `app/components/flow-diagram/InfoPopup.tsx`
- `app/components/flow-diagram/HistoryPanel.tsx`
- `app/components/flow-diagram/StepDetailModal.tsx`
- `app/components/flow-diagram/BranchDetailModal.tsx`
- `app/components/flow-diagram/EdgeActionModal.tsx`
- `app/components/flow-diagram/CollapsibleSection.tsx`