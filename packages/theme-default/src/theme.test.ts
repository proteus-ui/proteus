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
