import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useSearchFilter } from "./useSearchFilter";

describe("useSearchFilter", () => {
  const items = [{ n: "Ada" }, { n: "Bob" }] as const;
  const getHaystack = (i: { n: string }) => i.n;

  it("returns items whose haystack includes the query case-insensitively", () => {
    const { result } = renderHook(() =>
      useSearchFilter(items, "a", getHaystack),
    );
    expect(result.current).toEqual([{ n: "Ada" }]);
  });

  it("returns all items when the query is empty", () => {
    const { result } = renderHook(() =>
      useSearchFilter(items, "", getHaystack),
    );
    expect(result.current).toEqual([{ n: "Ada" }, { n: "Bob" }]);
  });
});
