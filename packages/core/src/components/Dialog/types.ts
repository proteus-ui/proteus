import type { HTMLAttributes } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";
import type { CompoundChildren, SlotElement } from "../../utils/compound";
import type { DialogActions, DialogBody, DialogTitle } from "./Dialog";

export type DialogSlot = "overlay" | "panel" | "title" | "body" | "actions";

export type DialogTitleProps = HTMLAttributes<HTMLDivElement>;
export type DialogBodyProps = HTMLAttributes<HTMLDivElement>;
export type DialogActionsProps = HTMLAttributes<HTMLDivElement>;

export type DialogSlotChild =
  | SlotElement<typeof DialogTitle>
  | SlotElement<typeof DialogBody>
  | SlotElement<typeof DialogActions>;

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  classNames?: SlotClassNames<DialogSlot>;
  children?: CompoundChildren<DialogSlotChild>;
}
