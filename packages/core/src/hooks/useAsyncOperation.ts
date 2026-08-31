import { useCallback, useRef, useState } from "react";

export function useAsyncOperation(): {
  status: "idle" | "pending" | "success" | "error";
  error: Error | null;
  run: (fn: () => Promise<void>) => Promise<void>;
} {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState<Error | null>(null);
  const generation = useRef(0);

  const run = useCallback(async (fn: () => Promise<void>) => {
    const gen = ++generation.current;
    setStatus("pending");
    setError(null);
    try {
      await fn();
      if (gen !== generation.current) return;
      setStatus("success");
    } catch (e) {
      if (gen !== generation.current) return;
      setError(e instanceof Error ? e : new Error(String(e)));
      setStatus("error");
    }
  }, []);

  return { status, error, run };
}
