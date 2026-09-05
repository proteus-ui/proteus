import type { SlotClassNames } from "@proteus-ui/tokens";

export type InlineEditControlsSlot = "root";

export interface InlineEditControlsProps {
  /** When `true`, shows save and cancel; otherwise shows edit. */
  editing: boolean;
  /** Enter edit mode. */
  onEdit: () => void;
  /** Persist the current value and leave edit mode. */
  onSave: () => void;
  /** Discard changes and leave edit mode. */
  onCancel: () => void;
  /** Per-slot class names (`root`). */
  classNames?: SlotClassNames<"root">;
}
