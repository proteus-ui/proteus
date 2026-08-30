import { useEffect, useId, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { FocusScope } from "@react-aria/focus";
import { ariaHideOutside, usePreventScroll } from "@react-aria/overlays";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../utils/cn";
import { useCloseOnEscape } from "../hooks/useCloseOnEscape";
import { useDialogTransition } from "../hooks/useDialogTransition";

export type DialogSlot = "overlay" | "panel" | "title" | "body" | "actions";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  actions?: ReactNode;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  classNames?: SlotClassNames<DialogSlot>;
  children?: ReactNode;
}

export function Dialog({
  open,
  onClose,
  title,
  actions,
  ariaLabel,
  ariaDescribedBy,
  closeOnOverlayClick = true,
  closeOnEscape = true,
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
      data-testid="pr-dialog-overlay"
      data-state={phase}
      className={cn("pr-dialog-overlay", classNames?.overlay)}
      onMouseDown={onOverlayMouseDown}
    >
      <FocusScope contain restoreFocus autoFocus>
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          aria-describedby={ariaDescribedBy}
          data-state={phase}
          tabIndex={-1}
          className={cn("pr-dialog", classNames?.panel)}
        >
          {title != null && (
            <div id={titleId} className={cn("pr-dialog__title", classNames?.title)}>
              {title}
            </div>
          )}
          <div className={cn("pr-dialog__body", classNames?.body)}>{children}</div>
          {actions != null && (
            <div className={cn("pr-dialog__actions", classNames?.actions)}>{actions}</div>
          )}
        </div>
      </FocusScope>
    </div>,
    document.body,
  );
}
