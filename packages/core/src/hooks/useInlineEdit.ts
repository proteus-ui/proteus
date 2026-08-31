import { useState } from "react";

export interface UseInlineEditReturn {
  editing: boolean;
  draft: string;
  setDraft: (v: string) => void;
  start: () => void;
  commit: () => string;
  cancel: () => void;
  value: string;
}

export function useInlineEdit(initial: string): UseInlineEditReturn {
  const [value, setValue] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [editing, setEditing] = useState(false);

  const start = () => {
    setDraft(value);
    setEditing(true);
  };

  const commit = () => {
    setValue(draft);
    setEditing(false);
    return draft;
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  return { editing, draft, setDraft, start, commit, cancel, value };
}
