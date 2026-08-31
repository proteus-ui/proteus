import { cn } from "../../utils/cn";
import { Button, OutlineButton } from "../Button";
import { INLINE_EDIT_CLASS, INLINE_EDIT_LABEL } from "./consts";
import type { InlineEditControlsProps } from "./types";

export function InlineEditControls({
  editing,
  onEdit,
  onSave,
  onCancel,
  classNames,
}: InlineEditControlsProps) {
  return (
    <div className={cn(INLINE_EDIT_CLASS.root, classNames?.root)}>
      {editing ? (
        <>
          <Button onClick={onSave}>{INLINE_EDIT_LABEL.Save}</Button>
          <OutlineButton onClick={onCancel}>{INLINE_EDIT_LABEL.Cancel}</OutlineButton>
        </>
      ) : (
        <Button onClick={onEdit}>{INLINE_EDIT_LABEL.Edit}</Button>
      )}
    </div>
  );
}
