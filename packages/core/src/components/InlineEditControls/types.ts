import type { SlotClassNames } from "@proteus-ui/tokens";

export type InlineEditControlsSlot = "root";

export interface InlineEditControlsProps {
  editing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  classNames?: SlotClassNames<"root">;
}
