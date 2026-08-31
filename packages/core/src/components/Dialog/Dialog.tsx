import { useEffect, useId, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { createPortal } from "react-dom";
import { FocusScope } from "@react-aria/focus";
import { ariaHideOutside, usePreventScroll } from "@react-aria/overlays";
import { cn } from "../../utils/cn";
import { useCloseOnEscape } from "../../hooks/useCloseOnEscape";
import { useDialogTransition } from "../../hooks/useDialogTransition";
import { DIALOG_ARIA_MODAL, DIALOG_CLASS, DIALOG_DEFAULT, DIALOG_TEST_ID } from "./consts";
import type { DialogProps } from "./types";

export function Dialog({
  open,
  onClose,
  title,
  actions,
  ariaLabel,
  ariaDescribedBy,
  closeOnOverlayClick = DIALOG_DEFAULT.closeOnOverlayClick,
  closeOnEscape = DIALOG_DEFAULT.closeOnEscape,
  classNames,
  children,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [ready, setReady] = useState(false);
  const { mounted, phase } = useDialogTransition(open, panelRef);

  useEffect(() => {
    setReady(true);
  }, []);

  useCloseOnEscape(open && closeOnEscape, onClose);
  usePreventScroll({ isDisabled: !ready || !mounted });

  useEffect(() => {
    if (!ready || !mounted) return;
    const panel = panelRef.current;
    if (!panel) return;
    return ariaHideOutside([panel]);
  }, [ready, mounted]);

  // `ready` is false on the server and on the first client paint, so the
  // portal does not hydrate-mismatch a null SSR tree.
  if (!ready || !mounted) return null;

  const onOverlayMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!open || !closeOnOverlayClick) return;
    if (e.target === e.currentTarget) onClose();
  };

  const labelledBy = ariaLabel == null && title != null ? titleId : undefined;

  // FocusScope: `contain` traps Tab, `restoreFocus` returns focus to the
  // trigger on unmount, `autoFocus` focuses the first focusable on open.
  return createPortal(
    <div
      data-testid={DIALOG_TEST_ID.Overlay}
      data-state={phase}
      className={cn(DIALOG_CLASS.overlay, classNames?.overlay)}
      onMouseDown={onOverlayMouseDown}
    >
      <FocusScope contain restoreFocus autoFocus>
        <div
          ref={panelRef}
          role="dialog"
          aria-modal={DIALOG_ARIA_MODAL}
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          aria-describedby={ariaDescribedBy}
          data-state={phase}
          tabIndex={-1}
          className={cn(DIALOG_CLASS.panel, classNames?.panel)}
        >
          {title != null && (
            <div id={titleId} className={cn(DIALOG_CLASS.title, classNames?.title)}>
              {title}
            </div>
          )}
          <div className={cn(DIALOG_CLASS.body, classNames?.body)}>{children}</div>
          {actions != null && (
            <div className={cn(DIALOG_CLASS.actions, classNames?.actions)}>{actions}</div>
          )}
        </div>
      </FocusScope>
    </div>,
    document.body,
  );
}
