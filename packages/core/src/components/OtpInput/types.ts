import type { SlotClassNames } from "@proteus-ui/tokens";

export type OtpInputSlot = "root" | "cell" | "error";

export interface OtpInputProps {
  /** Controlled code string. Pair with `onChange`. */
  value?: string;
  /** Initial code for uncontrolled use. */
  defaultValue?: string;
  /** Called when the code string changes. */
  onChange?: (value: string) => void;
  /** Called when every cell is filled. */
  onComplete?: (value: string) => void;
  /** Called when focus leaves the group. */
  onBlur?: () => void;
  /** Return `false` to reject a character at an optional index. */
  onValidate?: (value: string, index?: number) => boolean;
  /** Number of cells. */
  otpLength?: number;
  /** Disables all cells. */
  disabled?: boolean;
  /** Focus the first empty cell on mount. */
  shouldAutoFocus?: boolean;
  /** Marks the group invalid and exposes `data-invalid`. */
  invalid?: boolean;
  /** Error text shown when `invalid` is set. */
  errorMessage?: string;
  /** Accessible name for the group. */
  ariaLabel?: string;
  /** Class on the root element. */
  className?: string;
  /** Per-slot class names (`root`, `cell`, `error`). */
  classNames?: SlotClassNames<OtpInputSlot>;
}
