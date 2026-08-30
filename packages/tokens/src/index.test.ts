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
