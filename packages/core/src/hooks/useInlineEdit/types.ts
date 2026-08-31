export interface UseInlineEditReturn {
  editing: boolean;
  draft: string;
  setDraft: (v: string) => void;
  start: () => void;
  commit: () => string;
  cancel: () => void;
  value: string;
}
