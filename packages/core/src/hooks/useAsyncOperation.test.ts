import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useAsyncOperation } from "./useAsyncOperation";

describe("useAsyncOperation", () => {
  it("run sets pending then success", async () => {
    const { result } = renderHook(() => useAsyncOperation());
    expect(result.current.status).toBe("idle");
    expect(result.current.error).toBeNull();

    let resolveFn!: () => void;
    const pending = new Promise<void>((resolve) => {
      resolveFn = resolve;
    });

    let runPromise: Promise<void>;
    act(() => {
      runPromise = result.current.run(() => pending);
    });
    expect(result.current.status).toBe("pending");

    await act(async () => {
      resolveFn();
      await runPromise;
    });
    expect(result.current.status).toBe("success");
    expect(result.current.error).toBeNull();
  });

  it("rejecting sets error status and Error", async () => {
    const { result } = renderHook(() => useAsyncOperation());
    const boom = new Error("boom");
    await act(async () => {
      await result.current.run(() => Promise.reject(boom));
    });
    expect(result.current.status).toBe("error");
    expect(result.current.error).toBe(boom);
  });

  it("wraps a non-Error rejection in Error", async () => {
    const { result } = renderHook(() => useAsyncOperation());
    await act(async () => {
      await result.current.run(() => Promise.reject("nope"));
    });
    expect(result.current.status).toBe("error");
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("nope");
  });

  it("ignores a stale run that settles after a newer one", async () => {
    const { result } = renderHook(() => useAsyncOperation());
    let rejectFirst!: (reason: unknown) => void;
    const first = new Promise<void>((_, reject) => {
      rejectFirst = reject;
    });

    let firstRun: Promise<void>;
    act(() => {
      firstRun = result.current.run(() => first);
    });
    await act(async () => {
      await result.current.run(() => Promise.resolve());
    });
    expect(result.current.status).toBe("success");

    await act(async () => {
      rejectFirst(new Error("stale"));
      await firstRun;
    });
    expect(result.current.status).toBe("success");
    expect(result.current.error).toBeNull();
  });
});

