import { describe, expect, expectTypeOf, it } from "vitest";
import { TOKEN_VARS, type SlotClassNames } from "./index";

describe("@proteus-ui/tokens", () => {
  it("exposes canonical token variable names", () => {
    expect(TOKEN_VARS).toContain("--pr-color-action-primary");
    expect(TOKEN_VARS).toContain("--pr-radius-md");
    expect(TOKEN_VARS).toContain("--pr-font-size-lg");
    expect(TOKEN_VARS).toContain("--pr-font-size-xl");
    expect(TOKEN_VARS).toContain("--pr-font-size-2xl");
    expect(TOKEN_VARS).toContain("--pr-font-weight-semibold");
    expect(TOKEN_VARS).toContain("--pr-font-mono");
    expect(TOKEN_VARS).toContain("--pr-color-border-hover");
    expect(TOKEN_VARS).toContain("--pr-color-surface-hover");
    expect(TOKEN_VARS).toContain("--pr-focus-ring-color");
    expect(TOKEN_VARS).toContain("--pr-focus-ring-width");
    expect(TOKEN_VARS).toContain("--pr-focus-ring-offset");
    expect(TOKEN_VARS).toContain("--pr-opacity-disabled");
    expect(TOKEN_VARS).toContain("--pr-transition-control");
    expect(TOKEN_VARS).toContain("--pr-icon-select-toggle");
    expect(TOKEN_VARS).toContain("--pr-icon-collapse-chevron");
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
