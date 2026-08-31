export const NUMBER_STEPPER_CLASS = {
  root: "pr-stepper",
  field: "pr-stepper__field",
  inc: "pr-stepper__inc",
  dec: "pr-stepper__dec",
} as const;

export const NUMBER_STEPPER_DEFAULT = {
  value: 0,
  step: 1,
} as const;

export const NUMBER_STEPPER_LABEL = {
  Decrease: "Decrease value",
  Increase: "Increase value",
} as const;

export const NUMBER_STEPPER_SYMBOL = {
  Decrease: "−",
  Increase: "+",
} as const;

export const DATA_TRUE = "true";
