import { useCallback, useRef, useState } from "react";
import type { UseConfirmationReturn } from "./types";

export function useConfirmation(): UseConfirmationReturn {
  const [open, setOpen] = useState(false);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const settle = useCallback((value: boolean) => {
    resolverRef.current?.(value);
    resolverRef.current = null;
    setOpen(false);
  }, []);

  const ask = useCallback(() => {
    if (resolverRef.current) {
      resolverRef.current(false);
    }
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const confirm = useCallback(() => settle(true), [settle]);
  const cancel = useCallback(() => settle(false), [settle]);

  return { open, ask, confirm, cancel };
}
