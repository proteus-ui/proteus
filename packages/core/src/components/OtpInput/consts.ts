export const OTP_INPUT_CLASS = {
  root: "pr-otp",
  cell: "pr-otp__cell",
  error: "pr-otp__error",
} as const;

export const OTP_INPUT_DEFAULT = {
  value: "",
  length: 6,
  shouldAutoFocus: true,
  disabled: false,
  invalid: false,
  ariaLabel: "One-time code",
} as const;

export const OTP_CELL_ID_SUFFIX = "cell";
export const OTP_ERROR_ID_SUFFIX = "error";

export const OTP_DIGIT_RE = /^\d$/;
export const OTP_NON_DIGIT_RE = /\D/g;
export const OTP_CELL_PATTERN = "[0-9]*";

export const DATA_TRUE = "true";
