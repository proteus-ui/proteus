import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useConfirmation } from "./useConfirmation";

describe("useConfirmation", () => {
  it("ask then confirm resolves true", async () => {
    const { result } = renderHook(() => useConfirmation());
    expect(result.current.open).toBe(false);
    let promise: Promise<boolean>;
    act(() => {
      promise = result.current.ask();
    });
    expect(result.current.open).toBe(true);
    act(() => {
      result.current.confirm();
    });
    await expect(promise!).resolves.toBe(true);
    expect(result.current.open).toBe(false);
  });

  it("ask then cancel resolves false", async () => {
    const { result } = renderHook(() => useConfirmation());
    let promise: Promise<boolean>;
    act(() => {
      promise = result.current.ask();
    });
    act(() => {
      result.current.cancel();
    });
    await expect(promise!).resolves.toBe(false);
    expect(result.current.open).toBe(false);
  });

  it("ask while already open resolves the previous promise as false", async () => {
    const { result } = renderHook(() => useConfirmation());
    let first: Promise<boolean>;
    let second: Promise<boolean>;
    act(() => {
      first = result.current.ask();
    });
    act(() => {
      second = result.current.ask();
    });
    await expect(first!).resolves.toBe(false);
    expect(result.current.open).toBe(true);
    act(() => {
      result.current.confirm();
    });
    await expect(second!).resolves.toBe(true);
  });
});
