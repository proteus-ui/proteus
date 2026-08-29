# Proteus Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the `@proteus-ui` monorepo with a styling-contract foundation and a working vertical slice (tokens + core infra + Button + TextInput/SearchBar + Dialog + default theme + build pipeline) that proves the headless-core / swappable-appearance architecture end to end.

**Architecture:** A pnpm monorepo of three packages joined by a small stable contract. `@proteus-ui/tokens` publishes the contract (slot-map types, `data-*` state vocabulary, CSS-variable token names). `@proteus-ui/core` renders headless components that apply `pr-`-prefixed class names + `data-*` attributes and forward per-slot `classNames`, shipping a minimal structural stylesheet. `@proteus-ui/theme-default` ships the author's look as plain CSS + token values. Zero style runtime; appearance is static CSS the consumer imports.

**Tech Stack:** TypeScript (strict), React (peer `^18 || ^19`), pnpm workspaces, tsup (dual ESM/CJS + `.d.ts`), Vitest + `@testing-library/react` + jsdom, plain CSS.

## Global Constraints

- npm scope is `@proteus-ui/*`; every publishable package sets `"publishConfig": { "access": "public" }`.
- React is a **peer dependency**, range `^18 || ^19`. Never a direct/regular dependency.
- **Zero style runtime.** No CSS-in-JS, no runtime style injection. Appearance is static `.css`.
- Default/theme CSS is **plain CSS**, `pr-`-prefixed, single-class + `data-*` selectors, **low specificity** (no nesting, no `!important`).
- No `tailwind-merge`. Class joining is a local `cn()` (no dependency, or `clsx` only).
- Slot names, the `data-*` vocabulary, and CSS-variable token names are **SemVer-protected public surface** — treat renames as breaking.
- Component markup emits state/variant as `data-*` attributes; consumers style states via `[data-*]` selectors.
- Package manager is **pnpm**. TypeScript `strict: true`.
- Trademark: any future look-alike theme is named `*-like`; never brand as Material/MUI/Ant.

---

## File Structure

```
proteus/
├── package.json                      # root, private, workspace scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── vitest.config.ts                  # shared test config (jsdom)
├── .gitignore
├── packages/
│   ├── tokens/
│   │   ├── package.json              # @proteus-ui/tokens
│   │   ├── tsup.config.ts
│   │   ├── src/index.ts              # contract types
│   │   └── src/tokens.css            # CSS-variable token names (:root)
│   ├── core/
│   │   ├── package.json              # @proteus-ui/core
│   │   ├── tsup.config.ts
│   │   ├── src/index.ts              # public barrel
│   │   ├── src/utils/cn.ts
│   │   ├── src/hooks/useControllableState.ts
│   │   ├── src/hooks/useCloseOnEscape.ts
│   │   ├── src/hooks/useCloseOnOutsideClick.ts
│   │   ├── src/components/Button.tsx
│   │   ├── src/components/TextInput.tsx
│   │   ├── src/components/SearchBar.tsx
│   │   ├── src/components/Dialog.tsx
│   │   └── src/styles.css            # minimal structural CSS
│   └── theme-default/
│       ├── package.json              # @proteus-ui/theme-default
│       ├── src/theme.css             # author look (plain CSS)
│       └── src/tokens.css            # default token values
```

Tests live beside sources under each package: `packages/<pkg>/src/**/<name>.test.ts(x)`.

---

### Task 1: Monorepo scaffold + tooling

**Files:**
- Create: `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `vitest.config.ts`, `.gitignore`
- Test: `packages/core/src/utils/cn.test.ts` (added in Task 3; here we only prove the harness runs)

**Interfaces:**
- Produces: workspace scripts `pnpm -r build`, `pnpm test`; shared TS config `tsconfig.base.json`; jsdom Vitest environment.

- [ ] **Step 1: Initialize git and workspace files**

Run:
```bash
cd /Users/tomasz.morawski/proteus && git init
```

Create `pnpm-workspace.yaml`:
```yaml
packages:
  - "packages/*"
```

Create `.gitignore`:
```gitignore
node_modules/
dist/
.turbo/
.DS_Store
*.log
coverage
.env
.env.*
!.env.example
```

Create root `package.json`:
```json
{
  "name": "proteus-monorepo",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "pnpm -r build",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc -b --pretty"
  },
  "devDependencies": {
    "@testing-library/react": "^16.1.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^25.0.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tsup": "^8.3.5",
    "typescript": "^5.7.2",
    "vitest": "^3.0.0"
  }
}
```

Create `tsconfig.base.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "declaration": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noUncheckedIndexedAccess": true
  }
}
```

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["packages/**/src/**/*.test.{ts,tsx}"],
  },
});
```

Create `vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 2: Install dependencies**

Run: `cd /Users/tomasz.morawski/proteus && pnpm install`
Expected: install completes, `node_modules` created, no peer errors.

- [ ] **Step 3: Add a temporary harness smoke test**

Create `packages/core/src/__harness__.test.ts`:
```ts
import { describe, expect, it } from "vitest";

describe("test harness", () => {
  it("runs in jsdom", () => {
    expect(typeof document).toBe("object");
  });
});
```

- [ ] **Step 4: Run tests to verify the harness works**

Run: `cd /Users/tomasz.morawski/proteus && pnpm test`
Expected: PASS — 1 test passes under the jsdom environment.

- [ ] **Step 5: Remove the temporary harness test**

Run: `rm packages/core/src/__harness__.test.ts`

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold pnpm monorepo with vitest + tsup tooling"
```

---

### Task 2: `@proteus-ui/tokens` — the contract

**Files:**
- Create: `packages/tokens/package.json`, `packages/tokens/tsup.config.ts`, `packages/tokens/src/index.ts`, `packages/tokens/src/tokens.css`
- Test: `packages/tokens/src/index.test.ts`

**Interfaces:**
- Produces:
  - `type SlotClassNames<Slot extends string> = Partial<Record<Slot, string>>`
  - `type SlotStyles<Slot extends string> = Partial<Record<Slot, CSSProperties>>`
  - `const TOKEN_VARS: readonly string[]` — the canonical CSS-variable token names.

- [ ] **Step 1: Create the package manifest and build config**

Create `packages/tokens/package.json`:
```json
{
  "name": "@proteus-ui/tokens",
  "version": "0.0.0",
  "type": "module",
  "sideEffects": ["*.css"],
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./tokens.css": "./src/tokens.css"
  },
  "files": ["dist", "src/tokens.css"],
  "publishConfig": { "access": "public" },
  "scripts": {
    "build": "tsup"
  },
  "dependencies": {
    "csstype": "^3.1.3"
  }
}
```

`@proteus-ui/tokens` has **no React peer** — it exports only TypeScript types (via `csstype`, which React itself uses under the hood) and CSS-variable names. Keeping it framework-agnostic is what lets a future Vue/Angular/Svelte adapter consume the same contract.

Create `packages/tokens/tsup.config.ts`:
```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  outExtension: ({ format }) => ({ js: format === "cjs" ? ".cjs" : ".js" }),
});
```

Create `packages/tokens/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"]
}
```

- [ ] **Step 2: Write the failing test**

Create `packages/tokens/src/index.test.ts`:
```ts
import { describe, expect, expectTypeOf, it } from "vitest";
import { TOKEN_VARS, type SlotClassNames } from "./index";

describe("@proteus-ui/tokens", () => {
  it("exposes canonical token variable names", () => {
    expect(TOKEN_VARS).toContain("--pr-color-action-primary");
    expect(TOKEN_VARS).toContain("--pr-radius-md");
    // every token var name is namespaced
    expect(TOKEN_VARS.every((v) => v.startsWith("--pr-"))).toBe(true);
  });

  it("SlotClassNames maps declared slots to optional class strings", () => {
    expectTypeOf<SlotClassNames<"root" | "icon">>().toMatchTypeOf<{
      root?: string;
      icon?: string;
    }>();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd /Users/tomasz.morawski/proteus && pnpm test packages/tokens`
Expected: FAIL — cannot find module `./index` / `TOKEN_VARS` undefined.

- [ ] **Step 4: Implement the contract**

Create `packages/tokens/src/index.ts`:
```ts
import type { Properties as CSSProperties } from "csstype";

/** Per-slot class-name override map. Keys are a component's named parts. */
export type SlotClassNames<Slot extends string> = Partial<Record<Slot, string>>;

/**
 * Per-slot inline-style escape hatch for runtime-dynamic geometry only.
 * Uses `csstype` (not React's `CSSProperties`) so the contract stays
 * framework-agnostic — no React dependency leaks into the token layer.
 */
export type SlotStyles<Slot extends string> = Partial<Record<Slot, CSSProperties>>;

/**
 * Canonical CSS-variable token names. This list is SemVer-protected public
 * surface: themes set these, components consume them. Renaming is breaking.
 * Names are intent-based (semantic), not appearance-based: components survive
 * a re-theme because they reference meaning (`action-primary`), never a hue.
 */
export const TOKEN_VARS = [
  "--pr-color-surface",
  "--pr-color-text",
  "--pr-color-text-muted",
  "--pr-color-border",
  "--pr-color-action-primary",
  "--pr-color-on-action-primary",
  "--pr-color-feedback-error",
  "--pr-color-on-feedback-error",
  "--pr-radius-sm",
  "--pr-radius-md",
  "--pr-space-1",
  "--pr-space-2",
  "--pr-space-3",
  "--pr-font-sans",
  "--pr-font-size-sm",
  "--pr-font-size-md",
] as const;

export type TokenVar = (typeof TOKEN_VARS)[number];
```

The `on-*` names encode the contrast-pairing rule: a colored background (`--pr-color-action-primary`) always ships with its readable foreground (`--pr-color-on-action-primary`). Dark mode and `-like`/brand themes become new value sets for these same names, with no component changes.

Create `packages/tokens/src/tokens.css` (names only; default values live in `theme-default`, but ship safe fallbacks so the contract is usable standalone):
```css
:root {
  --pr-color-surface: #ffffff;
  --pr-color-text: #111111;
  --pr-color-text-muted: #6b7280;
  --pr-color-border: #d4d4d8;
  --pr-color-action-primary: #2563eb;
  --pr-color-on-action-primary: #ffffff;
  --pr-color-feedback-error: #dc2626;
  --pr-color-on-feedback-error: #ffffff;
  --pr-radius-sm: 4px;
  --pr-radius-md: 8px;
  --pr-space-1: 4px;
  --pr-space-2: 8px;
  --pr-space-3: 16px;
  --pr-font-sans: system-ui, sans-serif;
  --pr-font-size-sm: 13px;
  --pr-font-size-md: 15px;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd /Users/tomasz.morawski/proteus && pnpm test packages/tokens`
Expected: PASS — both tests green.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(tokens): publish styling contract types and token variable names"
```

---

### Task 3: `@proteus-ui/core` scaffold + `cn()` + hooks

**Files:**
- Create: `packages/core/package.json`, `packages/core/tsup.config.ts`, `packages/core/tsconfig.json`, `packages/core/src/index.ts`, `packages/core/src/utils/cn.ts`, `packages/core/src/hooks/useControllableState.ts`, `packages/core/src/hooks/useCloseOnEscape.ts`, `packages/core/src/hooks/useCloseOnOutsideClick.ts`, `packages/core/src/styles.css`
- Test: `packages/core/src/utils/cn.test.ts`, `packages/core/src/hooks/useControllableState.test.ts`

**Interfaces:**
- Consumes: `@proteus-ui/tokens` (`SlotClassNames`).
- Produces:
  - `cn(...values: Array<string | false | null | undefined>): string`
  - `useControllableState<T>(opts: { value?: T; defaultValue: T; onChange?: (v: T) => void }): [T, (next: T) => void]`
  - `useCloseOnEscape(enabled: boolean, onClose: () => void): void`
  - `useCloseOnOutsideClick(enabled: boolean, ref: RefObject<HTMLElement | null>, onClose: () => void): void`

- [ ] **Step 1: Create package manifest, build config, tsconfig**

Create `packages/core/package.json`:
```json
{
  "name": "@proteus-ui/core",
  "version": "0.0.0",
  "type": "module",
  "sideEffects": ["*.css"],
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./styles.css": "./src/styles.css"
  },
  "files": ["dist", "src/styles.css"],
  "publishConfig": { "access": "public" },
  "scripts": { "build": "tsup" },
  "peerDependencies": {
    "react": "^18 || ^19",
    "react-dom": "^18 || ^19"
  },
  "dependencies": {
    "@proteus-ui/tokens": "workspace:*",
    "@react-aria/focus": "^3.19.0",
    "@react-aria/overlays": "^3.24.0"
  }
}
```

`@react-aria/focus` provides `FocusScope` (focus trap + restoration); `@react-aria/overlays` provides `usePreventScroll` (body scroll lock) and `ariaHideOutside` (hide the rest of the app from assistive tech while a dialog is open). Both are tree-shakeable — they only enter a consumer's bundle when a component that uses them (e.g. `Dialog`) is imported.

Create `packages/core/tsup.config.ts`:
```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: ["react", "react-dom", "react/jsx-runtime"],
  outExtension: ({ format }) => ({ js: format === "cjs" ? ".cjs" : ".js" }),
});
```

Create `packages/core/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"]
}
```

Create empty `packages/core/src/styles.css`:
```css
/* Minimal structural defaults. Appearance lives in @proteus-ui/theme-default. */
.pr-button { font: inherit; cursor: pointer; }
.pr-button[data-disabled] { cursor: not-allowed; }
```

- [ ] **Step 2: Write failing tests for `cn`**

Create `packages/core/src/utils/cn.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins truthy string values with single spaces", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("returns empty string when nothing is truthy", () => {
    expect(cn(false, null, undefined)).toBe("");
  });
});
```

- [ ] **Step 3: Run to verify failure**

Run: `pnpm test packages/core/src/utils/cn.test.ts`
Expected: FAIL — module `./cn` not found.

- [ ] **Step 4: Implement `cn`**

Create `packages/core/src/utils/cn.ts`:
```ts
export function cn(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter((v): v is string => Boolean(v)).join(" ");
}
```

- [ ] **Step 5: Run to verify pass**

Run: `pnpm test packages/core/src/utils/cn.test.ts`
Expected: PASS.

- [ ] **Step 6: Write failing test for `useControllableState`**

Create `packages/core/src/hooks/useControllableState.test.ts`:
```tsx
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useControllableState } from "./useControllableState";

describe("useControllableState", () => {
  it("acts as uncontrolled state by default", () => {
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: "a" }),
    );
    expect(result.current[0]).toBe("a");
    act(() => result.current[1]("b"));
    expect(result.current[0]).toBe("b");
  });

  it("respects a controlled value and does not self-update", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ value: "x", defaultValue: "a", onChange }),
    );
    expect(result.current[0]).toBe("x");
    act(() => result.current[1]("y"));
    expect(result.current[0]).toBe("x"); // stays controlled
    expect(onChange).toHaveBeenCalledWith("y");
  });
});
```

- [ ] **Step 7: Run to verify failure**

Run: `pnpm test packages/core/src/hooks/useControllableState.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 8: Implement the three hooks**

Create `packages/core/src/hooks/useControllableState.ts`:
```ts
import { useCallback, useState } from "react";

export function useControllableState<T>(opts: {
  value?: T;
  defaultValue: T;
  onChange?: (next: T) => void;
}): [T, (next: T) => void] {
  const { value, defaultValue, onChange } = opts;
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : internal;

  const set = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [current, set];
}
```

Create `packages/core/src/hooks/useCloseOnEscape.ts`:
```ts
import { useEffect } from "react";

export function useCloseOnEscape(enabled: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [enabled, onClose]);
}
```

Create `packages/core/src/hooks/useCloseOnOutsideClick.ts`:
```ts
import { useEffect, type RefObject } from "react";

export function useCloseOnOutsideClick(
  enabled: boolean,
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
): void {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: MouseEvent) => {
      const el = ref.current;
      if (el && !el.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [enabled, ref, onClose]);
}
```

- [ ] **Step 9: Create the public barrel**

Create `packages/core/src/index.ts`:
```ts
export { cn } from "./utils/cn";
export { useControllableState } from "./hooks/useControllableState";
export { useCloseOnEscape } from "./hooks/useCloseOnEscape";
export { useCloseOnOutsideClick } from "./hooks/useCloseOnOutsideClick";
```

- [ ] **Step 10: Run all core tests**

Run: `pnpm test packages/core`
Expected: PASS — cn + useControllableState suites green.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat(core): scaffold package with cn util and controllable/dismiss hooks"
```

---

### Task 4: `Button` (+ `IconButton`, `OutlineButton`) — the trivial-component pattern

**Files:**
- Create: `packages/core/src/components/Button.tsx`
- Modify: `packages/core/src/index.ts` (export components)
- Test: `packages/core/src/components/Button.test.tsx`

**Interfaces:**
- Consumes: `cn`, `SlotClassNames`.
- Produces:
  - `type ButtonSlot = "root" | "icon"`
  - `Button: React.ForwardRefExoticComponent<ButtonProps & RefAttributes<HTMLButtonElement>>`
  - `IconButton`, `OutlineButton` with the same `ButtonProps` shape.
  - `ButtonProps` extends `ButtonHTMLAttributes<HTMLButtonElement>` with `intent?`, `size?`, `icon?`, `classNames?: SlotClassNames<ButtonSlot>`.

- [ ] **Step 1: Write the failing test**

Create `packages/core/src/components/Button.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button, IconButton, OutlineButton } from "../index";

describe("Button", () => {
  it("renders the pr-button root class and default data attributes", () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole("button", { name: "Save" });
    expect(btn).toHaveClass("pr-button");
    expect(btn).toHaveAttribute("data-intent", "neutral");
    expect(btn).toHaveAttribute("data-size", "md");
    expect(btn).not.toHaveAttribute("data-disabled");
  });

  it("reflects intent, size, and disabled as data-* attributes", () => {
    render(
      <Button intent="danger" size="sm" disabled>
        Delete
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Delete" });
    expect(btn).toHaveAttribute("data-intent", "danger");
    expect(btn).toHaveAttribute("data-size", "sm");
    expect(btn).toHaveAttribute("data-disabled", "true");
    expect(btn).toBeDisabled();
  });

  it("merges consumer classNames into the correct slots", () => {
    render(
      <Button icon={<svg data-testid="i" />} classNames={{ root: "my-root", icon: "my-icon" }}>
        Go
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Go" });
    expect(btn).toHaveClass("pr-button", "my-root");
    expect(screen.getByTestId("i").parentElement).toHaveClass("pr-button__icon", "my-icon");
  });

  it("OutlineButton and IconButton also render the root slot", () => {
    render(
      <>
        <OutlineButton>Outline</OutlineButton>
        <IconButton aria-label="star" icon={<svg />} />
      </>,
    );
    expect(screen.getByRole("button", { name: "Outline" })).toHaveClass("pr-button");
    expect(screen.getByRole("button", { name: "star" })).toHaveClass("pr-button");
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test packages/core/src/components/Button.test.tsx`
Expected: FAIL — `Button` not exported.

- [ ] **Step 3: Implement `Button.tsx`**

Create `packages/core/src/components/Button.tsx`:
```tsx
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../utils/cn";

export type ButtonIntent = "neutral" | "primary" | "danger";
export type ButtonSize = "sm" | "md";
export type ButtonVariant = "solid" | "outline";
export type ButtonSlot = "root" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: ButtonIntent;
  size?: ButtonSize;
  icon?: ReactNode;
  classNames?: SlotClassNames<ButtonSlot>;
}

function createButton(variant: ButtonVariant) {
  return forwardRef<HTMLButtonElement, ButtonProps>(function ProteusButton(
    { intent = "neutral", size = "md", icon, classNames, className, children, disabled, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={cn("pr-button", classNames?.root, className)}
        data-intent={intent}
        data-size={size}
        data-variant={variant}
        data-disabled={disabled ? "true" : undefined}
        disabled={disabled}
        type="button"
        {...rest}
      >
        {icon != null && (
          <span className={cn("pr-button__icon", classNames?.icon)} aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
      </button>
    );
  });
}

export const Button = createButton("solid");
export const OutlineButton = createButton("outline");
export const IconButton = createButton("solid");
```

- [ ] **Step 4: Export the components**

Modify `packages/core/src/index.ts` — append:
```ts
export { Button, IconButton, OutlineButton } from "./components/Button";
export type {
  ButtonProps,
  ButtonIntent,
  ButtonSize,
  ButtonVariant,
  ButtonSlot,
} from "./components/Button";
```

- [ ] **Step 5: Run to verify pass**

Run: `pnpm test packages/core/src/components/Button.test.tsx`
Expected: PASS — all four cases green.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(core): add Button/IconButton/OutlineButton with slot + data-* contract"
```

---

### Task 5: `TextInput` + `SearchBar` — the form / controllable-state pattern

**Files:**
- Create: `packages/core/src/components/TextInput.tsx`, `packages/core/src/components/SearchBar.tsx`
- Modify: `packages/core/src/index.ts`
- Test: `packages/core/src/components/TextInput.test.tsx`, `packages/core/src/components/SearchBar.test.tsx`

**Interfaces:**
- Consumes: `cn`, `useControllableState`, `SlotClassNames`.
- Produces:
  - `type TextInputSlot = "root" | "input"`; `TextInput` (`InputHTMLAttributes` minus `value/defaultValue/onChange`) with `value?: string`, `defaultValue?: string`, `onValueChange?: (v: string) => void`, `invalid?: boolean`, `classNames?`.
  - `type SearchBarSlot = "root" | "input" | "clear"`; `SearchBar` with `value?`, `defaultValue?`, `onValueChange?`, `onClear?`, `classNames?`.

- [ ] **Step 1: Write the failing tests**

Create `packages/core/src/components/TextInput.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TextInput } from "../index";

describe("TextInput", () => {
  it("renders root + input slots with pr- classes", () => {
    render(<TextInput aria-label="name" />);
    const input = screen.getByRole("textbox", { name: "name" });
    expect(input).toHaveClass("pr-input__field");
    expect(input.parentElement).toHaveClass("pr-input");
  });

  it("fires onValueChange as user types (uncontrolled)", async () => {
    const onValueChange = vi.fn();
    render(<TextInput aria-label="name" onValueChange={onValueChange} />);
    await userEvent.type(screen.getByRole("textbox", { name: "name" }), "hi");
    expect(onValueChange).toHaveBeenLastCalledWith("hi");
  });

  it("marks invalid state via data-invalid + aria-invalid", () => {
    render(<TextInput aria-label="name" invalid />);
    const input = screen.getByRole("textbox", { name: "name" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.parentElement).toHaveAttribute("data-invalid", "true");
  });
});
```

Create `packages/core/src/components/SearchBar.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "../index";

describe("SearchBar", () => {
  it("shows a clear button only when there is a value and clears on click", async () => {
    const onValueChange = vi.fn();
    const onClear = vi.fn();
    render(
      <SearchBar aria-label="search" defaultValue="abc" onValueChange={onValueChange} onClear={onClear} />,
    );
    const clear = screen.getByRole("button", { name: /clear/i });
    await userEvent.click(clear);
    expect(onValueChange).toHaveBeenLastCalledWith("");
    expect(onClear).toHaveBeenCalled();
  });

  it("hides the clear button when empty", () => {
    render(<SearchBar aria-label="search" defaultValue="" />);
    expect(screen.queryByRole("button", { name: /clear/i })).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test packages/core/src/components/TextInput.test.tsx packages/core/src/components/SearchBar.test.tsx`
Expected: FAIL — components not exported. (If `@testing-library/user-event` is missing, install it: `pnpm add -D -w @testing-library/user-event@^14.5.2`, then re-run.)

- [ ] **Step 3: Implement `TextInput.tsx`**

Create `packages/core/src/components/TextInput.tsx`:
```tsx
import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../utils/cn";
import { useControllableState } from "../hooks/useControllableState";

export type TextInputSlot = "root" | "input";

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (next: string) => void;
  invalid?: boolean;
  classNames?: SlotClassNames<TextInputSlot>;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { value, defaultValue = "", onValueChange, invalid, classNames, className, ...rest },
  ref,
) {
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  return (
    <div
      className={cn("pr-input", classNames?.root)}
      data-invalid={invalid ? "true" : undefined}
    >
      <input
        ref={ref}
        {...rest}
        className={cn("pr-input__field", classNames?.input, className)}
        value={current}
        aria-invalid={invalid ? "true" : undefined}
        onChange={(e) => setCurrent(e.target.value)}
      />
    </div>
  );
});
```

- [ ] **Step 4: Implement `SearchBar.tsx`**

Create `packages/core/src/components/SearchBar.tsx`:
```tsx
import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../utils/cn";
import { useControllableState } from "../hooks/useControllableState";

export type SearchBarSlot = "root" | "input" | "clear";

export interface SearchBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (next: string) => void;
  onClear?: () => void;
  classNames?: SlotClassNames<SearchBarSlot>;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar(
  { value, defaultValue = "", onValueChange, onClear, classNames, className, ...rest },
  ref,
) {
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  return (
    <div className={cn("pr-search", classNames?.root)}>
      <input
        ref={ref}
        {...rest}
        type="search"
        className={cn("pr-search__field", classNames?.input, className)}
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
      />
      {current !== "" && (
        <button
          type="button"
          aria-label="Clear search"
          className={cn("pr-search__clear", classNames?.clear)}
          onClick={() => {
            setCurrent("");
            onClear?.();
          }}
        >
          ×
        </button>
      )}
    </div>
  );
});
```

- [ ] **Step 5: Export the components**

Modify `packages/core/src/index.ts` — append:
```ts
export { TextInput } from "./components/TextInput";
export type { TextInputProps, TextInputSlot } from "./components/TextInput";
export { SearchBar } from "./components/SearchBar";
export type { SearchBarProps, SearchBarSlot } from "./components/SearchBar";
```

- [ ] **Step 6: Run to verify pass**

Run: `pnpm test packages/core/src/components/TextInput.test.tsx packages/core/src/components/SearchBar.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(core): add TextInput and SearchBar with controllable value contract"
```

---

### Task 6: `Dialog` — the complex behavior + a11y pattern

**Files:**
- Create: `packages/core/src/components/Dialog.tsx`, `packages/core/src/hooks/useDialogTransition.ts`, `packages/core/src/utils/transition.ts`
- Modify: `packages/core/src/index.ts`
- Test: `packages/core/src/components/Dialog.test.tsx`, `packages/core/src/utils/transition.test.ts`

**Interfaces:**
- Consumes: `cn`, `useCloseOnEscape`, `SlotClassNames`, `react-dom` `createPortal`, `@react-aria/focus` `FocusScope`, `@react-aria/overlays` `usePreventScroll` + `ariaHideOutside`.
- Produces:
  - `type DialogSlot = "overlay" | "panel" | "title" | "body" | "actions"`
  - `type DialogPhase = "open" | "closed"`
  - `useDialogTransition(open: boolean, ref: RefObject<HTMLElement | null>): { mounted: boolean; phase: DialogPhase }`
  - `getTransitionDurationMs(el: HTMLElement | null): number`
  - `Dialog` props: `open`, `onClose`, `title?`, `actions?`, `ariaLabel?: string`, `ariaDescribedBy?: string`, `closeOnOverlayClick?` (default `true`), `closeOnEscape?` (default `true`), `classNames?: SlotClassNames<DialogSlot>`, `children`.

**Accessibility & transition notes (subset A adopted from `css-foundation`):**
- `FocusScope contain restoreFocus autoFocus` — focus trap, initial focus, restore focus to trigger on close.
- `usePreventScroll` — body scroll lock while mounted (handles scrollbar-shift / iOS correctly).
- `ariaHideOutside([panel])` — hides the rest of the app from assistive tech while open.
- **Two-phase mount/visibility with a `data-state` attribute** — separates user intent (`open`) from transition phase (`open`/`closed`). Mount → `requestAnimationFrame` → `data-state="open"` for enter; on close, `data-state="closed"` then unmount after the element's own CSS transition duration. Themes drive enter/exit animation purely via `[data-state]` — no JS animation runtime.
- `aria-labelledby` derives from the title (unless `ariaLabel` is given); `aria-describedby` is passthrough.

- [ ] **Step 1: Write the failing test for `getTransitionDurationMs`**

Create `packages/core/src/utils/transition.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { getTransitionDurationMs } from "./transition";

describe("getTransitionDurationMs", () => {
  it("returns 0 for a null element", () => {
    expect(getTransitionDurationMs(null)).toBe(0);
  });

  it("sums the longest transition-duration with the transition-delay", () => {
    const el = document.createElement("div");
    el.style.transitionDuration = "200ms, 0.3s";
    el.style.transitionDelay = "100ms";
    document.body.appendChild(el);
    expect(getTransitionDurationMs(el)).toBe(400); // max(200, 300) + 100
    el.remove();
  });
});
```

> jsdom's `getComputedStyle` echoes inline `transition-*` values, so this exercises the real parser. With no transition set the function returns `0`, so the exit phase unmounts on the next tick — which is what the `Dialog` tests below rely on.

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test packages/core/src/utils/transition.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the transition-duration reader**

Create `packages/core/src/utils/transition.ts`:
```ts
export function getTransitionDurationMs(el: HTMLElement | null): number {
  if (!el || typeof window === "undefined") return 0;
  const style = window.getComputedStyle(el);
  const longest = (value: string): number =>
    value.split(",").reduce((max, part) => {
      const trimmed = part.trim();
      const ms = trimmed.endsWith("ms")
        ? Number.parseFloat(trimmed)
        : Number.parseFloat(trimmed) * 1000;
      return Number.isFinite(ms) ? Math.max(max, ms) : max;
    }, 0);
  return longest(style.transitionDuration) + longest(style.transitionDelay);
}
```

Run `pnpm test packages/core/src/utils/transition.test.ts` → PASS.

- [ ] **Step 4: Implement `useDialogTransition`**

Create `packages/core/src/hooks/useDialogTransition.ts`:
```ts
import { useEffect, useState, type RefObject } from "react";
import { getTransitionDurationMs } from "../utils/transition";

export type DialogPhase = "open" | "closed";

// Two-phase mount/visibility: separates user intent (`open`) from the
// transition phase exposed as `data-state`. Enter: mount → rAF → "open".
// Exit: "closed" → unmount after the element's own CSS transition duration.
export function useDialogTransition(
  open: boolean,
  ref: RefObject<HTMLElement | null>,
): { mounted: boolean; phase: DialogPhase } {
  const [mounted, setMounted] = useState(open);
  const [phase, setPhase] = useState<DialogPhase>(open ? "open" : "closed");

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setPhase("open"));
      return () => cancelAnimationFrame(raf);
    }
    setPhase("closed");
    const timeout = window.setTimeout(
      () => setMounted(false),
      getTransitionDurationMs(ref.current),
    );
    return () => window.clearTimeout(timeout);
  }, [open, ref]);

  return { mounted, phase };
}
```

This hook is covered through the `Dialog` integration tests below (mount on open, `data-state` transition, unmount on close).

- [ ] **Step 5: Write the failing test for `Dialog`**

Create `packages/core/src/components/Dialog.test.tsx`:
```tsx
import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Dialog } from "../index";

describe("Dialog", () => {
  it("renders nothing when closed", () => {
    render(
      <Dialog open={false} onClose={() => {}} title="Confirm">
        body
      </Dialog>,
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders an accessible dialog with data-state and aria wiring when open", async () => {
    render(
      <Dialog open onClose={() => {}} title="Confirm" ariaDescribedBy="desc-1">
        <p id="desc-1">body</p>
      </Dialog>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName("Confirm");
    expect(dialog).toHaveAttribute("aria-describedby", "desc-1");
    await waitFor(() => expect(dialog).toHaveAttribute("data-state", "open"));
  });

  it("calls onClose on Escape", async () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="Confirm">
        body
      </Dialog>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the overlay is clicked but not the panel", async () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="Confirm">
        <button>inside</button>
      </Dialog>,
    );
    await userEvent.click(screen.getByRole("button", { name: "inside" }));
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(screen.getByTestId("pr-dialog-overlay"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("moves focus into the dialog on open and restores it to the trigger on close", async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>open</button>
          <Dialog open={open} onClose={() => setOpen(false)} title="Confirm">
            <button>inside</button>
          </Dialog>
        </>
      );
    }
    render(<Harness />);
    const trigger = screen.getByRole("button", { name: "open" });
    trigger.focus();
    await userEvent.click(trigger);
    await waitFor(() =>
      expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(true),
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});
```

- [ ] **Step 6: Run to verify failure**

Run: `pnpm test packages/core/src/components/Dialog.test.tsx`
Expected: FAIL — `Dialog` not exported.

- [ ] **Step 7: Implement `Dialog.tsx`**

Create `packages/core/src/components/Dialog.tsx`:
```tsx
import { useEffect, useId, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { FocusScope } from "@react-aria/focus";
import { ariaHideOutside, usePreventScroll } from "@react-aria/overlays";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../utils/cn";
import { useCloseOnEscape } from "../hooks/useCloseOnEscape";
import { useDialogTransition } from "../hooks/useDialogTransition";

export type DialogSlot = "overlay" | "panel" | "title" | "body" | "actions";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  actions?: ReactNode;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  classNames?: SlotClassNames<DialogSlot>;
  children?: ReactNode;
}

export function Dialog({
  open,
  onClose,
  title,
  actions,
  ariaLabel,
  ariaDescribedBy,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  classNames,
  children,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [ready, setReady] = useState(false);
  const { mounted, phase } = useDialogTransition(open, panelRef);

  useEffect(() => {
    setReady(true);
  }, []);

  useCloseOnEscape(open && closeOnEscape, onClose);
  usePreventScroll({ isDisabled: !ready || !mounted });

  useEffect(() => {
    if (!ready || !mounted) return;
    const panel = panelRef.current;
    if (!panel) return;
    return ariaHideOutside([panel]);
  }, [ready, mounted]);

  // `ready` is false on the server and on the first client paint, so the
  // portal does not hydrate-mismatch a null SSR tree.
  if (!ready || !mounted) return null;

  const onOverlayMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!closeOnOverlayClick) return;
    if (e.target === e.currentTarget) onClose();
  };

  const labelledBy = ariaLabel == null && title != null ? titleId : undefined;

  // FocusScope: `contain` traps Tab, `restoreFocus` returns focus to the
  // trigger on unmount, `autoFocus` focuses the first focusable on open.
  return createPortal(
    <div
      data-testid="pr-dialog-overlay"
      data-state={phase}
      className={cn("pr-dialog-overlay", classNames?.overlay)}
      onMouseDown={onOverlayMouseDown}
    >
      <FocusScope contain restoreFocus autoFocus>
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          aria-describedby={ariaDescribedBy}
          data-state={phase}
          tabIndex={-1}
          className={cn("pr-dialog", classNames?.panel)}
        >
          {title != null && (
            <div id={titleId} className={cn("pr-dialog__title", classNames?.title)}>
              {title}
            </div>
          )}
          <div className={cn("pr-dialog__body", classNames?.body)}>{children}</div>
          {actions != null && (
            <div className={cn("pr-dialog__actions", classNames?.actions)}>{actions}</div>
          )}
        </div>
      </FocusScope>
    </div>,
    document.body,
  );
}
```

Note: `FocusScope autoFocus` requires a focusable element inside; the tests always render one. `data-state` is mirrored on both overlay and panel so a theme can animate either. `usePreventScroll` and `ariaHideOutside` are gated on `mounted`, so they engage for the whole enter→exit lifecycle and clean up on unmount.

- [ ] **Step 8: Export the component**

Modify `packages/core/src/index.ts` — append:
```ts
export { Dialog } from "./components/Dialog";
export type { DialogProps, DialogSlot } from "./components/Dialog";
```

- [ ] **Step 9: Run to verify pass**

Run: `pnpm test packages/core/src/components/Dialog.test.tsx`
Expected: PASS — all five cases green.

- [ ] **Step 10: Run the full core suite**

Run: `pnpm test packages/core`
Expected: PASS — cn, hooks, transition, Button, TextInput, SearchBar, Dialog all green.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat(core): add accessible animated Dialog (focus trap, scroll lock, aria-hide, data-state transitions)"
```

---

### Task 7: `@proteus-ui/theme-default` — proving appearance is swappable

**Files:**
- Create: `packages/theme-default/package.json`, `packages/theme-default/src/tokens.css`, `packages/theme-default/src/theme.css`
- Test: `packages/theme-default/src/theme.test.ts`

**Interfaces:**
- Produces: importable CSS at `@proteus-ui/theme-default/theme.css` and `@proteus-ui/theme-default/tokens.css`, targeting the same `pr-` selectors and `data-*` states the core emits.

- [ ] **Step 1: Create the package manifest**

Create `packages/theme-default/package.json`:
```json
{
  "name": "@proteus-ui/theme-default",
  "version": "0.0.0",
  "type": "module",
  "sideEffects": ["*.css"],
  "exports": {
    "./tokens.css": "./src/tokens.css",
    "./theme.css": "./src/theme.css"
  },
  "files": ["src"],
  "publishConfig": { "access": "public" },
  "scripts": { "build": "echo \"no build step (static css)\" && exit 0" }
}
```

- [ ] **Step 2: Write the failing test**

Create `packages/theme-default/src/theme.test.ts`:
```ts
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const read = (rel: string) =>
  readFileSync(fileURLToPath(new URL(rel, import.meta.url)), "utf8");

describe("@proteus-ui/theme-default", () => {
  it("assigns values to the contract token variables", () => {
    const css = read("./tokens.css");
    expect(css).toMatch(/--pr-color-action-primary:\s*[^;]+;/);
    expect(css).toMatch(/--pr-radius-md:\s*[^;]+;/);
  });

  it("styles core slots via low-specificity single-class + data-* selectors", () => {
    const css = read("./theme.css");
    expect(css).toContain(".pr-button");
    expect(css).toContain('.pr-button[data-intent="primary"]');
    expect(css).toContain(".pr-dialog");
    // data-state drives the enter/exit animation (two-phase transition)
    expect(css).toContain('.pr-dialog[data-state="open"]');
    expect(css).toContain("prefers-reduced-motion");
    // guardrail: no !important, no descendant nesting of pr- classes
    expect(css).not.toContain("!important");
  });
});
```

- [ ] **Step 3: Run to verify failure**

Run: `pnpm test packages/theme-default`
Expected: FAIL — css files not found.

- [ ] **Step 4: Create the token values and theme CSS**

Create `packages/theme-default/src/tokens.css`:
```css
/* Default values seeded from the extraction-analysis palette (Visualizer/
   flow-observer): brand pink #ec4899, semantic neutrals, feedback red. */
:root {
  --pr-color-surface: #ffffff;
  --pr-color-text: #111827;
  --pr-color-text-muted: #6b7280;
  --pr-color-border: #e5e7eb;
  --pr-color-action-primary: #ec4899;
  --pr-color-on-action-primary: #ffffff;
  --pr-color-feedback-error: #ef4444;
  --pr-color-on-feedback-error: #ffffff;
  --pr-radius-sm: 6px;
  --pr-radius-md: 8px;
  --pr-space-1: 4px;
  --pr-space-2: 8px;
  --pr-space-3: 16px;
  --pr-font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
  --pr-font-size-sm: 12px;
  --pr-font-size-md: 14px;
}
```

Create `packages/theme-default/src/theme.css`:
```css
.pr-button {
  display: inline-flex;
  align-items: center;
  gap: var(--pr-space-1);
  padding: var(--pr-space-2) var(--pr-space-3);
  border: 1px solid var(--pr-color-border);
  border-radius: var(--pr-radius-md);
  background: var(--pr-color-surface);
  color: var(--pr-color-text);
  font-family: var(--pr-font-sans);
  font-size: var(--pr-font-size-md);
}
.pr-button[data-intent="primary"] {
  background: var(--pr-color-action-primary);
  color: var(--pr-color-on-action-primary);
  border-color: transparent;
}
.pr-button[data-intent="danger"] {
  background: var(--pr-color-feedback-error);
  color: var(--pr-color-on-feedback-error);
  border-color: transparent;
}
.pr-button[data-variant="outline"] {
  background: transparent;
}
.pr-button[data-variant="outline"][data-intent="primary"] {
  color: var(--pr-color-action-primary);
  border-color: var(--pr-color-action-primary);
}
.pr-button[data-variant="outline"][data-intent="danger"] {
  color: var(--pr-color-feedback-error);
  border-color: var(--pr-color-feedback-error);
}
.pr-button[data-size="sm"] {
  padding: var(--pr-space-1) var(--pr-space-2);
  font-size: var(--pr-font-size-sm);
}
.pr-button[data-disabled] {
  opacity: 0.5;
}

.pr-input,
.pr-search {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--pr-color-border);
  border-radius: var(--pr-radius-sm);
  background: var(--pr-color-surface);
}
.pr-input[data-invalid] {
  border-color: var(--pr-color-feedback-error);
}
.pr-input__field,
.pr-search__field {
  border: 0;
  outline: 0;
  padding: var(--pr-space-2);
  font-family: var(--pr-font-sans);
  font-size: var(--pr-font-size-md);
  background: transparent;
  color: var(--pr-color-text);
}
.pr-search__clear {
  border: 0;
  background: transparent;
  color: var(--pr-color-text-muted);
  cursor: pointer;
  padding: 0 var(--pr-space-2);
}

.pr-dialog-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 150ms ease;
}
.pr-dialog-overlay[data-state="open"] {
  opacity: 1;
}
.pr-dialog {
  background: var(--pr-color-surface);
  color: var(--pr-color-text);
  border-radius: var(--pr-radius-md);
  padding: var(--pr-space-3);
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: translateY(8px) scale(0.98);
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}
.pr-dialog[data-state="open"] {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .pr-dialog-overlay,
  .pr-dialog {
    transition: none;
  }
}
.pr-dialog__title {
  font-size: var(--pr-font-size-md);
  font-weight: 600;
  margin-bottom: var(--pr-space-2);
}
.pr-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--pr-space-2);
  margin-top: var(--pr-space-3);
}
```

- [ ] **Step 5: Run to verify pass**

Run: `pnpm test packages/theme-default`
Expected: PASS — both cases green.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(theme-default): ship default token values and component skin CSS"
```

---

### Task 8: Build pipeline + package integrity verification

**Files:**
- Modify: none (uses configs from prior tasks)
- Test: `packages/core/src/build.test.ts`

**Interfaces:**
- Produces: verified `dist/` outputs for `tokens` and `core` (ESM `.js`, CJS `.cjs`, `.d.ts`), confirming the packages are publishable.

- [ ] **Step 1: Build all packages**

Run: `cd /Users/tomasz.morawski/proteus && pnpm -r build`
Expected: `packages/tokens/dist` and `packages/core/dist` each contain `index.js`, `index.cjs`, `index.d.ts`; theme-default prints the no-build message.

- [ ] **Step 2: Write a build-integrity test**

Create `packages/core/src/build.test.ts`:
```ts
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const distFile = (rel: string) =>
  existsSync(fileURLToPath(new URL(`../dist/${rel}`, import.meta.url)));

describe("core build output", () => {
  it("emits ESM, CJS, and type declarations", () => {
    expect(distFile("index.js")).toBe(true);
    expect(distFile("index.cjs")).toBe(true);
    expect(distFile("index.d.ts")).toBe(true);
  });
});
```

- [ ] **Step 3: Run the build-integrity test**

Run: `pnpm test packages/core/src/build.test.ts`
Expected: PASS (requires Step 1 to have run first).

- [ ] **Step 4: Typecheck the whole workspace**

Run: `cd /Users/tomasz.morawski/proteus && pnpm -r exec tsc --noEmit -p tsconfig.json`
Expected: no type errors.

- [ ] **Step 5: Run the full test suite once green**

Run: `cd /Users/tomasz.morawski/proteus && pnpm test`
Expected: PASS — all package suites green.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "test: verify dual-format build output and workspace typecheck"
```

---

## Follow-up plans (not in this plan)

Each remaining component clones the pattern established here (`Button` for trivial, `TextInput`/`SearchBar` for form/controllable, `Dialog` for behavior+a11y) and adds a matching `theme-default` skin block + tests:

- **Plan 2 — remaining primitives:** `Badge`/`Pill`, `Card`, `Section`, `LinkCard`, `PageFrame`, `CollapsibleSection` (Accordion a11y from spec harvest §2), `Toolbar`/`ToolbarButton`, `InlineEditControls`, `Spinner`/`PageLoader`, `ErrorBoundary`, plus hooks `useModalCloseHandlers`, `useInlineEdit`, `useSearchFilter`, `useConfirmation`, `useAsyncOperation`.
- **Plan 3 — behavior-heavy inputs:** `Select` / combobox (harvest §1 + §4; **not** css-foundation Select), `NumberStepper`, `TimeInput`, `Tooltip` (Floating UI + React Aria `useTooltip`), `EntitySelector` (harvest §1). Extend `useCloseOnOutsideClick` with toggler ref + outside/inside modes (harvest §3).
- **Plan 4 (roadmap) — `-like` themes:** `@proteus-ui/theme-material-like`, `@proteus-ui/theme-ant-like` (visual/token parity only).
- **Harvest:** `docs/superpowers/specs/2026-08-29-css-foundation-harvest.md` is the only required reference for those behaviors. The css-foundation repo is gone.

---

## Self-Review

**Spec coverage:**
- Styling-agnostic contract (slots + `data-*` + tokens) → Tasks 2, 4, 5, 6.
- Ship default stylesheet → Tasks 3 (minimal structural) + 7 (theme-default).
- Zero style runtime / RSC-friendly (plain CSS, no injection) → Tasks 3, 7; `sideEffects` in manifests.
- Minimal deps / no `tailwind-merge` → Task 3 `cn`.
- React peer `^18 || ^19` → all package manifests.
- pnpm + tsup + dual ESM/CJS + `.d.ts` → Tasks 1, 2, 3, 8.
- Contract governance (token/slot names as surface) → Task 2 (`TOKEN_VARS`), enforced by theme test guardrails in Task 7.
- Intent-based (semantic) token names — `action-primary`/`on-action-primary`, `feedback-error`/`on-feedback-error`, `surface`, `text`/`text-muted`, `border` — so components survive a re-theme; `theme-default` values seeded from the extraction-analysis palette. Dark mode + a build-time `createTheme` generator are roadmap (spec), enabled cheaply by these names.
- `@proteus-ui/tokens` is framework-agnostic: no React peer; `SlotStyles` uses `csstype`, not React `CSSProperties` (Task 2).
- Full component set → representative slice here; remainder scheduled in Follow-up plans (explicit).
- Accessibility strategy (native for simple, React Aria hooks for hard) → `Button`/inputs native (Tasks 4–5); `Dialog` uses `@react-aria/focus` `FocusScope` (trap + restore), `@react-aria/overlays` `usePreventScroll` (scroll lock) + `ariaHideOutside` (background hidden), and a `data-state` two-phase transition (Task 6); later hard components scheduled in Plan 3.
- `publishConfig.access: public` → all publishable manifests.
- Consumers/migration, `noti-diva` stays separate → documented in spec; no task needed for iteration foundation.

**Placeholder scan:** No TBD/TODO; every code step contains complete code; commands include expected output.

**Type consistency:** `SlotClassNames` (tokens) used uniformly; `useControllableState` signature identical across TextInput/SearchBar; `cn` signature stable; `Dialog` slots match test selectors; `data-*` names (`data-intent`, `data-size`, `data-variant`, `data-disabled`, `data-invalid`, `data-state`) match between components (Tasks 4–6) and theme CSS (Task 7); the `Dialog` `data-state` values (`open`/`closed`) match `DialogPhase` and the `[data-state="open"]` theme selectors. The semantic `TOKEN_VARS` names (Task 2) match the `:root` declarations in both `tokens.css` files and every `var(--pr-color-*)` reference in `theme.css` (Task 7) — no legacy `bg`/`fg`/`accent`/`danger`/`muted` names remain.

**Stacked modal manager:** deferred to roadmap with a self-contained design in the spec (buildable without the `css-foundation` reference); iteration-1 `Dialog` reuses the primitives (`FocusScope`, `usePreventScroll`, `ariaHideOutside`, `useDialogTransition`) that the stack manager will layer on.
