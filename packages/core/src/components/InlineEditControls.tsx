import type { SlotClassNames } from "@proteus-ui/tokens";
import { cn } from "../utils/cn";
import { Button, OutlineButton } from "./Button";

export type InlineEditControlsSlot = "root";

export interface InlineEditControlsProps {
  editing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  classNames?: SlotClassNames<"root">;
}

export function InlineEditControls({
  editing,
  onEdit,
  onSave,
  onCancel,
  classNames,
}: InlineEditControlsProps) {
  return (
    <div className={cn("pr-inline-edit", classNames?.root)}>
      {editing ? (
        <>
          <Button onClick={onSave}>Save</Button>
          <OutlineButton onClick={onCancel}>Cancel</OutlineButton>
        </>
      ) : (
        <Button onClick={onEdit}>Edit</Button>
      )}
    </div>
  );
}
