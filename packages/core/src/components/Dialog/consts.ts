export const DIALOG_CLASS = {
  overlay: "pr-dialog-overlay",
  panel: "pr-dialog",
  title: "pr-dialog__title",
  body: "pr-dialog__body",
  actions: "pr-dialog__actions",
} as const;

export const DIALOG_DEFAULT = {
  closeOnOverlayClick: true,
  closeOnEscape: true,
} as const;

export const DIALOG_TEST_ID = {
  Overlay: "pr-dialog-overlay",
} as const;

export const DIALOG_ARIA_MODAL = "true";
