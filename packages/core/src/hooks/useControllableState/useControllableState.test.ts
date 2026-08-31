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
