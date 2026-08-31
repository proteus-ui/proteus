import { useCallback, useRef, useState } from "react";
import { ASYNC_STATUS } from "./consts";
import type { AsyncOperationStatus, UseAsyncOperationReturn } from "./types";

export function useAsyncOperation(): UseAsyncOperationReturn {
  const [status, setStatus] = useState<AsyncOperationStatus>(ASYNC_STATUS.Idle);
  const [error, setError] = useState<Error | null>(null);
  const generation = useRef(0);

  const run = useCallback(async (fn: () => Promise<void>) => {
    const gen = ++generation.current;
    setStatus(ASYNC_STATUS.Pending);
    setError(null);
    try {
      await fn();
      if (gen !== generation.current) return;
      setStatus(ASYNC_STATUS.Success);
    } catch (e) {
      if (gen !== generation.current) return;
      setError(e instanceof Error ? e : new Error(String(e)));
      setStatus(ASYNC_STATUS.Error);
    }
  }, []);

  return { status, error, run };
}
