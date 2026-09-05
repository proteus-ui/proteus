import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { createPortal } from "react-dom";
import { FocusScope } from "@react-aria/focus";
import { ariaHideOutside, usePreventScroll } from "@react-aria/overlays";
import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../../utils/cn";
import { asSlot, collectNamedSlots } from "../../utils/compound";
import { useCloseOnEscape } from "../../hooks/useCloseOnEscape";
import { useDialogTransition } from "../../hooks/useDialogTransition";
import {
  DIALOG_ARIA_MODAL,
  DIALOG_CLASS,
  DIALOG_DEFAULT,
  DIALOG_DISPLAY_NAME,
  DIALOG_TEST_ID,
} from "./consts";
import type {
  DialogActionsProps,
  DialogBodyProps,
  DialogProps,
  DialogSlot,
  DialogTitleProps,
} from "./types";

type DialogContextValue = {
  titleId: string;
  classNames?: SlotClassNames<DialogSlot>;
};

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export const DialogTitle = asSlot(DIALOG_DISPLAY_NAME.Title, function DialogTitle({
  className,
  children,
  ...rest
}: DialogTitleProps) {
  const ctx = useContext(DialogContext);
  return (
    <div
      id={ctx?.titleId}
      className={cn(DIALOG_CLASS.title, ctx?.classNames?.title, className)}
      {...rest}
    >
      {children}
    </div>
  );
});

export const DialogBody = asSlot(DIALOG_DISPLAY_NAME.Body, function DialogBody({
  className,
  children,
  ...rest
}: DialogBodyProps) {
  const ctx = useContext(DialogContext);
  return (
    <div className={cn(DIALOG_CLASS.body, ctx?.classNames?.body, className)} {...rest}>
      {children}
    </div>
  );
});

export const DialogActions = asSlot(DIALOG_DISPLAY_NAME.Actions, function DialogActions({
  className,
  children,
  ...rest
}: DialogActionsProps) {
  const ctx = useContext(DialogContext);
  return (
    <div className={cn(DIALOG_CLASS.actions, ctx?.classNames?.actions, className)} {...rest}>
      {children}
    </div>
  );
});

export function Dialog({
  open,
  onClose,
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
  const slots = collectNamedSlots(
    children,
    { Title: DialogTitle, Body: DialogBody, Actions: DialogActions },
    DIALOG_DISPLAY_NAME.Root,
  );

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

  if (!ready || !mounted) return null;

  const onOverlayMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!open || !closeOnOverlayClick) return;
    if (e.target === e.currentTarget) onClose();
  };

  const labelledBy = ariaLabel == null && slots.Title != null ? titleId : undefined;

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
          <DialogContext.Provider value={{ titleId, classNames }}>
            {slots.Title}
            {slots.Body}
            {slots.Actions}
          </DialogContext.Provider>
        </div>
      </FocusScope>
    </div>,
    document.body,
  );
}

Dialog.Title = DialogTitle;
Dialog.Body = DialogBody;
Dialog.Actions = DialogActions;
Dialog.displayName = DIALOG_DISPLAY_NAME.Root;
