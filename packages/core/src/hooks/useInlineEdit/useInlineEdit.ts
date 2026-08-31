import { useCallback, useState } from "react";
import type { UseInlineEditReturn } from "./types";

export function useInlineEdit(initial: string): UseInlineEditReturn {
  const [value, setValue] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [editing, setEditing] = useState(false);

  const setDraftValue = useCallback((v: string) => {
    setDraft(v);
  }, []);

  const start = useCallback(() => {
    setDraft(value);
    setEditing(true);
  }, [value]);

  const commit = useCallback(() => {
    setValue(draft);
    setEditing(false);
    return draft;
  }, [draft]);

  const cancel = useCallback(() => {
    setDraft(value);
    setEditing(false);
  }, [value]);

  return { editing, draft, setDraft: setDraftValue, start, commit, cancel, value };
}
