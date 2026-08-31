import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useInlineEdit } from "./useInlineEdit";

describe("useInlineEdit", () => {
  it("starts, edits draft, commits, and cancels", () => {
    const { result } = renderHook(() => useInlineEdit("a"));
    expect(result.current.editing).toBe(false);
    act(() => result.current.start());
    expect(result.current.editing).toBe(true);
    act(() => result.current.setDraft("b"));
    act(() => {
      expect(result.current.commit()).toBe("b");
    });
    expect(result.current.value).toBe("b");
    expect(result.current.editing).toBe(false);
    act(() => result.current.start());
    act(() => result.current.setDraft("c"));
    act(() => result.current.cancel());
    expect(result.current.value).toBe("b");
    expect(result.current.draft).toBe("b");
  });
});
