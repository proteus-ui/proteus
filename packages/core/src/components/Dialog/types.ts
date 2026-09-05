import type { HTMLAttributes, ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type DialogSlot = "overlay" | "panel" | "title" | "body" | "actions";

export type DialogTitleProps = HTMLAttributes<HTMLDivElement>;
export type DialogBodyProps = HTMLAttributes<HTMLDivElement>;
export type DialogActionsProps = HTMLAttributes<HTMLDivElement>;

export interface DialogProps {
  /** Whether the dialog is shown. */
  open: boolean;
  /** Called when the dialog should close (overlay, Escape, or consumer action). */
  onClose: () => void;
  /** Accessible name when `Dialog.Title` is not used. */
  ariaLabel?: string;
  /** `id` of the element that describes the dialog. */
  ariaDescribedBy?: string;
  /** Close when the overlay is pressed. Defaults to `true`. */
  closeOnOverlayClick?: boolean;
  /** Close on Escape. Defaults to `true`. */
  closeOnEscape?: boolean;
  /** Per-slot class names (`overlay`, `panel`, `title`, `body`, `actions`). */
  classNames?: SlotClassNames<DialogSlot>;
  /** Slot children: `Dialog.Title`, `Dialog.Body`, `Dialog.Actions`. */
  children?: ReactNode;
}
