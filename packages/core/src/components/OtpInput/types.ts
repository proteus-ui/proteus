import type { SlotClassNames } from "@proteus-ui/tokens";

export type OtpInputSlot = "root" | "cell" | "error";

export interface OtpInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  onBlur?: () => void;
  onValidate?: (value: string, index?: number) => boolean;
  otpLength?: number;
  disabled?: boolean;
  shouldAutoFocus?: boolean;
  invalid?: boolean;
  errorMessage?: string;
  ariaLabel?: string;
  className?: string;
  classNames?: SlotClassNames<OtpInputSlot>;
}
