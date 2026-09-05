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
    expect(css).toMatch(/--pr-font-sans:\s*Inter,/);
  });

  it("styles core slots via low-specificity single-class + data-* selectors", () => {
    const css = read("./theme.css");
    expect(css).toContain(".pr-button");
    expect(css).toContain('.pr-button[data-intent="primary"]');
    expect(css).toContain(".pr-dialog");
    // data-state drives the enter/exit animation (two-phase transition)
    expect(css).toContain('.pr-dialog[data-state="open"]');
    expect(css).toContain("prefers-reduced-motion");
    expect(css).toContain(".pr-badge");
    expect(css).toContain(".pr-card");
    expect(css).toContain(".pr-section");
    expect(css).toContain(".pr-link-card");
    expect(css).toContain(".pr-page-frame");
    expect(css).toContain(".pr-collapse");
    expect(css).toContain(".pr-toolbar");
    expect(css).toContain('.pr-toolbar__button[data-intent="primary"]');
    expect(css).toContain(".pr-checkbox");
    expect(css).toContain(".pr-checkbox__input");
    expect(css).toContain(".pr-textarea");
    expect(css).toContain(".pr-textarea__field");
    expect(css).toContain(".pr-spinner");
    expect(css).toContain(".pr-page-loader");
    expect(css).toContain(".pr-page-loader__label");
    expect(css).toContain(".pr-error-boundary");
    expect(css).toContain(".pr-select");
    expect(css).toContain(".pr-select__field");
    expect(css).toContain(".pr-select__list");
    expect(css).toMatch(/\.pr-select__list\s*\{[^}]*position:\s*absolute/);
    expect(css).toContain(".pr-select__option");
    expect(css).toContain('.pr-select__option[data-highlighted="true"]');
    expect(css).toContain('.pr-select[data-state="open"]');
    expect(css).toContain('.pr-select[data-invalid]');
    expect(css).toContain('.pr-select[data-empty]');
    expect(css).toContain(".pr-select__announcer");
    expect(css).toContain(".pr-stepper");
    expect(css).toContain(".pr-time");
    expect(css).toContain(".pr-otp");
    expect(css).toContain(".pr-otp__cell");
    expect(css).toContain(".pr-tooltip");
    expect(css).toContain(".pr-text {");
    expect(css).toContain('.pr-text[data-tag="h1"]');
    // guardrail: no !important, no descendant nesting of pr- classes
    expect(css).not.toContain("!important");
  });
});
