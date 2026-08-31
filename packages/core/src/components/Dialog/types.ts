import type { ReactNode } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

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
