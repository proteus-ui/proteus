# Enterprise Design System Architecture & Testing Specification

## 1. Executive Summary & Design System Philosophy

This document defines the architectural standard, component interface principles, and testing pipeline for an enterprise-grade, framework-agnostic design system.

### Core System Principles

1. **Specialized Components Over Monolithic Flags:** Avoid "God Components" that use complex boolean flags (`isIconButton`, `variant="code"`). Use self-documenting, specialized primitives (`<IconButton>`, `<Text.Paragraph>`, `<Text.Code>`).
2. **Dual Export Strategy:** Support clean DX via dot-notation namespaces (`<Text.Paragraph>`) while exporting standalone primitives (`ParagraphText`) to guarantee 100% build-time tree-shaking.
3. **Strict Separation of Concerns:**
   - `variant`: Defines container rendering and structural style (`solid`, `outline`, `ghost`, `link`).
   - `size`: Defines universal scale (`xs`, `sm`, `md`, `lg`, `xl`) consistently across **all** system components.
   - `intent`: Defines semantic color tokens (`primary`, `neutral`, `danger`, `success`).
4. **Layout Hygiene:** Components control internal padding and border geometry. Components **never** apply external margins (`margin`, `top`, `bottom`). All outer spacing is governed by layout primitives (`<Stack>`, `<Grid>`).
5. **Headless Core + Dual State Control:** Abstract state machines (via Zag.js / pure JS primitives) to power multi-framework wrappers (React, Vue, Web Components). Support both controlled (`value`/`onChange`) and uncontrolled (`defaultValue`) modes natively.
6. **Self-Hosted Zero-Flake QA Pipeline:** Fast **Vitest** (tokens, hooks, DOM/ARIA) gates every change. Visual, accessibility, and responsive regression then run via **Storybook**, **Playwright**, and **Docker**—no paid SaaS (Chromatic).

---

## 2. Component API & Interface Architecture

### A. The Button & IconButton Specification

`<Button>` exclusively handles text and text-with-icon layouts. Single-icon actions must use `<IconButton>`, which enforces accessible labeling (`aria-label`) at compile time.

```typescript
import React, { ButtonHTMLAttributes, ReactNode, ReactElement } from 'react';

// Common visual tokens shared across all button primitives
export interface BaseButtonProps {
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
  intent?: 'primary' | 'secondary' | 'neutral' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
  isLoading?: boolean;
}

// 1. Standard Button (Text / Text + Leading/Trailing Icons)
export interface ButtonProps
  extends BaseButtonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  loadingText?: string;
  children?: ReactNode;
}

// 2. Specialized IconButton (Enforces aria-label & single icon)
export interface IconButtonProps
  extends BaseButtonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'children'> {
  /** Required accessible label for screen readers */
  'aria-label': string;
  /** The icon element to render inside 1:1 square/circular container */
  icon: ReactElement;
}
```

### B. The Text Subcomponent & Tree-Shakable Export Architecture

To achieve clean DX without sacrificing tree-shaking, components are authored as standalone functions, combined into namespaces via Object.assign, and exported both ways.

```typescript
import React, { HTMLAttributes, ReactNode } from 'react';

export interface BaseTextProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'subtle' | 'primary' | 'danger';
  align?: 'left' | 'center' | 'right';
  truncate?: boolean;
  noOfLines?: number;
  children?: ReactNode;
}

// Subcomponent Props
export type ParagraphTextProps = BaseTextProps & HTMLAttributes<HTMLParagraphElement>;
export type SpanTextProps = BaseTextProps & HTMLAttributes<HTMLSpanElement>;
export type CodeTextProps = BaseTextProps & HTMLAttributes<HTMLElement>;

// Standalone Component Implementations (Tree-Shakable)
export const ParagraphText: React.FC<ParagraphTextProps> = ({
  size = 'md',
  weight = 'regular',
  color = 'default',
  align,
  truncate,
  noOfLines,
  className = '',
  children,
  ...props
}) => (
  <p
    className={[
      'ds-text',
      `ds-text--${size}`,
      `ds-text--weight-${weight}`,
      `ds-text--color-${color}`,
      align ? `ds-text--align-${align}` : '',
      truncate ? 'ds-text--truncate' : '',
      noOfLines && !truncate ? 'ds-text--line-clamp' : '',
      className,
    ].filter(Boolean).join(' ')}
    style={noOfLines && !truncate ? ({ '--ds-line-clamp': noOfLines } as React.CSSProperties) : undefined}
    {...props}
  >
    {children}
  </p>
);

export const SpanText: React.FC<SpanTextProps> = ({ size = 'md', className = '', children, ...props }) => (
  <span className={['ds-text', `ds-text--${size}`, className].filter(Boolean).join(' ')} {...props}>
    {children}
  </span>
);

export const CodeText: React.FC<CodeTextProps> = ({ size = 'sm', className = '', children, ...props }) => (
  <code className={['ds-text-code', `ds-text-code--${size}`, className].filter(Boolean).join(' ')} {...props}>
    {children}
  </code>
);

// -----------------------------------------------------------------------------
// Dual Export Strategy Implementation
// -----------------------------------------------------------------------------

// 1. Compound Object Namespace Export (Used as <Text.Paragraph>)
export const Text = Object.assign(ParagraphText, {
  Paragraph: ParagraphText,
  Span: SpanText,
  Code: CodeText,
});

// 2. Standalone Named Exports (Enables 100% build-time tree-shaking)
// Usage: import { ParagraphText } from '@my-ds/react';
```

## 3. Design System Testing Pyramid

```
┌──────────────────────────────────────────────────────────┐
│ Playwright + Storybook                                   │
│ Visual snapshots, CSS layout, responsive matrix          │  Heavy (real browser / Docker)
│ CI vs Vercel preview URL                                 │
├──────────────────────────────────────────────────────────┤
│ Vitest + RTL                                             │
│ Component DOM attributes, ARIA, React hooks              │  Fast (jsdom)
├──────────────────────────────────────────────────────────┤
│ Vitest                                                   │
│ Design tokens, type assertions, pure utilities           │  Instant (Node)
└──────────────────────────────────────────────────────────┘
```

No double-testing: Vitest asserts behavior (`data-intent`, class merge, hook state). Storybook + Playwright assert appearance (token color at that attribute, wrap at 375px).

### Responsibility matrix

| Scope | Tool | Example in this repo | Environment | Speed |
| --- | --- | --- | --- | --- |
| Token verification & types | Vitest | `packages/tokens/src/index.test.ts` (`expectTypeOf`, token namespace) | Node | ~10ms |
| Custom React hooks | Vitest + RTL | `packages/core/src/hooks/useAsyncOperation/useAsyncOperation.test.ts` (`renderHook`, `act`) | jsdom | ~50ms |
| Component micro-DOM / ARIA | Vitest + RTL | `packages/core/src/components/Badge/Badge.test.tsx` (`data-intent`, `data-variant`, `classNames`) | jsdom | ~100ms |
| Visual & cross-browser layout | Storybook + Playwright | `apps/storybook` + Docker against the Vercel preview URL | Chromium (Docker) | ~2–5s |

**Dev loop:** `pnpm test:unit:watch` while editing hooks or primitives — sub-second feedback. Do not wait on Docker or a preview URL for logic.

---

## 4. Root Vitest monorepo configuration

Root `vitest.config.ts` already runs `packages/**/src/**/*.test.{ts,tsx}` under jsdom. Target: Vitest workspaces so `pnpm test:unit` executes `packages/core`, `packages/tokens`, `packages/theme-default` (and later `apps/*` logic tests) in parallel.

`vitest.workspace.ts` at the monorepo root:

```ts
import { defineWorkspace } from "vitest/config";

export default defineWorkspace(["packages/*", "apps/*"]);
```

Root `vitest.config.ts` (shared defaults):

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["packages/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["**/node_modules/**", "**/dist/**", "**/*.stories.tsx"],
    },
  },
});
```

Keep Node environment overrides for token / build tests (today: `environmentMatchGlobs` for `packages/core/src/build.test.ts`).

---

## 5. Playwright + Storybook Testing Architecture

By configuring @storybook/test-runner alongside Playwright, we replicate and exceed Chromatic’s testing features: executing story play interaction functions, scanning WCAG accessibility, and taking pixel-diff visual snapshots.

### A. Core Flake Prevention Rules (Injected CSS)

```css
/* .storybook/visual-test-overrides.css */

/* Freeze all animations, transitions, and text carets globally */
*,
*::before,
*::after {
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
  caret-color: transparent !important;
}

/* Hide scrollbars across runners */
::-webkit-scrollbar {
  display: none !important;
}
html {
  scrollbar-width: none !important;
}
```

### B. Storybook Test Runner & Playwright Pipeline

```typescript
// .storybook/test-runner.ts
import type { TestRunnerConfig } from '@storybook/test-runner';
import { injectAxe, checkA11y } from 'axe-playwright';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { BREAKPOINTS } from '../tests/config/breakpoints';

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },

  async preRender(page) {
    // 1. Emulate standard media environment
    await page.emulateMedia({ colorScheme: "light", media: "screen" });

    // 2. Freeze timers & dates to prevent dynamic diff flakiness
    await page.clock.setFixedTime(new Date('2026-01-01T12:00:00Z'));

    // 3. Inject CSS overrides for animation freezing & caret suppression
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
          caret-color: transparent !important;
        }
        ::-webkit-scrollbar { display: none !important; }
        html { scrollbar-width: none !important; }
      `,
    });
  },

  async postRender(page, context) {
    // 4. Font & Image Loading Locks
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve);
          });
        })
      );
    });

    // 5. Automated Accessibility Audit (axe-core)
    await injectAxe(page);
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });

    // 6. Responsive Matrix Execution Logic
    const storyParams = context.parameters || {};
    const targetViewports: Array<keyof typeof BREAKPOINTS> = storyParams.responsiveViewports || [];

    if (targetViewports.length === 0) {
      // Default single-viewport snapshot for static primitives
      const image = await page.screenshot({ fullPage: true });
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: context.id,
        failureThreshold: 0.01,
        failureThresholdType: 'percent',
      });
      return;
    }

    // Dynamic Multi-Viewport Execution Loop for Responsive Components
    for (const vpKey of targetViewports) {
      const { width, height } = BREAKPOINTS[vpKey];
      await page.setViewportSize({ width, height });
      await page.evaluate(() => document.fonts.ready);

      const image = await page.screenshot({ fullPage: true });
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: `${context.id}-${vpKey}`,
        failureThreshold: 0.01,
        failureThresholdType: 'percent',
      });
    }
  },
};

export default config;
```

## 6. Responsive Design Testing Specification

### A. Centralized Breakpoint Tokens

```typescript
// tests/config/breakpoints.ts
export const BREAKPOINTS = {
  sm: { width: 375, height: 667 },   // Mobile
  md: { width: 768, height: 1024 },  // Tablet
  lg: { width: 1280, height: 800 },  // Desktop
  xl: { width: 1920, height: 1080 }, // Ultra-wide
} as const;
```

### B. Story Configuration Patterns

#### Selective Viewport Tagging (@media testing)

Standard primitives remain single-viewport. Complex layout components opt into multi-viewport loops via metadata parameters.

#### Container Query Matrix (@container testing)

Components using CSS container queries are tested by mounting them inside fixed-width container wrappers inside a single story frame, executing responsive tests in a single snapshot.

```typescript
// packages/react/src/Card/Card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
};
export default meta;

// Container Query Testing (Single Snapshot, Multiple Container Widths)
export const ContainerQueryMatrix: StoryObj<typeof Card> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Stacked Layout Container */}
      <div style={{ containerType: 'inline-size', width: '300px', border: '1px dashed #ccc' }}>
        <Card title="Narrow Container (300px)"/>
      </div>

      {/* Horizontal Layout Container */}
      <div style={{ containerType: 'inline-size', width: '700px', border: '1px dashed #ccc' }}>
        <Card title="Wide Container (700px)"/>
      </div>
    </div>
  ),
};

// Viewport Media Query Testing (Triggers multi-viewport Playwright loop)
export const ResponsiveNavbar: StoryObj = {
  parameters: {
    responsiveViewports: ['sm', 'md', 'lg'],
  },
};
```

## 7. Docker Infrastructure setup for Operating System Equality

To eliminate sub-pixel font rendering differences between macOS, Windows, and Linux CI runners, all tests are executed inside Playwright’s standardized Linux Docker container.

### A. Docker Environment Configuration (Dockerfile.test)

```dockerfile
# Dockerfile.test
FROM mcr.microsoft.com/playwright:v1.41.0-jammy

WORKDIR /app

# Copy monorepo manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages

# Install pnpm and dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

# Expose Storybook default port
EXPOSE 6006

CMD ["pnpm", "test:visual:container"]
```

### B. Package scripts — unit vs visual

Root `package.json`. Vitest is the default local test. Playwright never runs unless asked (`test:visual` / `test:all`).

```json
{
  "name": "proteus-monorepo",
  "private": true,
  "scripts": {
    "storybook": "pnpm --filter @proteus-ui/storybook storybook",
    "build-storybook": "pnpm --filter @proteus-ui/storybook build-storybook",

    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "test:coverage": "vitest run --coverage",

    "test:visual": "docker run --rm -v $(pwd):/app -w /app mcr.microsoft.com/playwright:v1.41.0-jammy pnpm test:visual:container",
    "test:visual:container": "concurrently -k -s first \"npx http-server apps/storybook/storybook-static -p 6006 --silent\" \"wait-on tcp:6006 && pnpm --filter @proteus-ui/storybook test-storybook\"",
    "test:visual:update": "docker run --rm -v $(pwd):/app -w /app mcr.microsoft.com/playwright:v1.41.0-jammy pnpm --filter @proteus-ui/storybook test-storybook --updateSnapshot",

    "test:all": "pnpm test:unit && pnpm test:visual"
  }
}
```

Today `pnpm test` / `pnpm test:watch` are the Vitest aliases. When this split lands, keep `test` as `test:unit` or a thin alias so existing muscle memory still hits jsdom, not Docker.

---

## 8. Continuous Integration (GitHub Actions) & Diff Reporting

Run Vitest first. It finishes in a few seconds; a broken hook or `data-*` contract fails the build before Vercel wait or Docker/Playwright. Visual QA is `needs: unit-tests` and hits the **Vercel preview URL**, not a locally built Storybook, so CI sees the same CSS the preview serves.

When visual or a11y fails, Playwright’s HTML report (side-by-side diffs, axe traces) uploads as a GitHub Actions artifact.

```yaml
# .github/workflows/ci.yml
name: CI Quality Gate

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  unit-tests:
    name: Unit & DOM Logic (Vitest)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - name: Install Dependencies
        run: pnpm install --frozen-lockfile
      - name: Run Vitest Suite (All Packages)
        run: pnpm test:unit

  visual-qa:
    name: Visual & Responsive QA (Playwright)
    needs: unit-tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Wait for Vercel Preview Deployment
        uses: patrickedqvist/wait-for-vercel-preview@v1.3.0
        id: vercel_preview
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          max_timeout: 300
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - name: Install Dependencies
        run: pnpm install --frozen-lockfile
      - name: Execute Dockerized Playwright against Vercel URL
        run: |
          docker run --rm \
            -v $(pwd):/app \
            -w /app \
            mcr.microsoft.com/playwright:v1.41.0-jammy \
            pnpm --filter @proteus-ui/storybook test-storybook --url ${{ steps.vercel_preview.outputs.url }}
      - name: Upload Visual Diff Artifacts on Failure
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-visual-diffs
          path: |
            apps/storybook/__snapshots__/__diff_output__/
          retention-days: 7
```

---

## 9. Operational Summary & Verification Matrix

| Domain | Architectural Rule | Verification Tool |
| --- | --- | --- |
| Tokens & types | Semantic token names and TypeScript contract stay valid. | Vitest (Node) — `packages/tokens`. |
| Hooks | Controlled/uncontrolled and async state machines behave. | Vitest + RTL (`renderHook`) — `packages/core/src/hooks`. |
| Component DOM / ARIA | Slots, `data-*`, class merge, accessible names. | Vitest + RTL (jsdom) — e.g. `Badge.test.tsx`. |
| Component Tree-Shaking | Export standalone functions + namespace objects (Text.Paragraph & ParagraphText). | Rollup / esbuild bundle analysis. |
| API Consistency | Universal size scale (xs-xl) across all primitives; variant restricted to visual styling. | TypeScript interface inspection. |
| Layout Safety | Zero outer margins on primitives. Spacing governed by layout wrappers (`<Stack>`). | Playwright visual regression. |
| Accessibility (a11y) | 100% WCAG 2.1 AA compliance; automated ID linkage via `useId()`. | axe-playwright in Storybook test-runner. |
| Visual Stability | CSS animation zeroing, caret hiding, font readiness locks, and frozen system clocks. | Playwright screenshot diff engine. |
| Cross-Platform Parity | Local & CI visual snapshots executed strictly inside Linux Docker containers. | Docker / GitHub Actions runner. |
| CI cost | Logic failures never start Docker or wait on Vercel. | `visual-qa` `needs: unit-tests`. |
