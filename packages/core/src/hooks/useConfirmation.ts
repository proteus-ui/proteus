import { useRef, useState } from "react";

export function useConfirmation(): {
  open: boolean;
  ask: () => Promise<boolean>;
  confirm: () => void;
  cancel: () => void;
} {
  const [open, setOpen] = useState(false);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const settle = (value: boolean) => {
    resolverRef.current?.(value);
    resolverRef.current = null;
    setOpen(false);
  };

  const ask = () => {
    if (resolverRef.current) {
      resolverRef.current(false);
    }
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  };

  const confirm = () => settle(true);
  const cancel = () => settle(false);

  return { open, ask, confirm, cancel };
}
