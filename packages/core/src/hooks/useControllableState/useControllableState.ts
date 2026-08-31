import { useCallback, useState } from "react";
import type { UseControllableStateOptions, UseControllableStateReturn } from "./types";

export function useControllableState<T>(
  opts: UseControllableStateOptions<T>,
): UseControllableStateReturn<T> {
  const { value, defaultValue, onChange } = opts;
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : internal;

  const set = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [current, set];
}
