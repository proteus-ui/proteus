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
