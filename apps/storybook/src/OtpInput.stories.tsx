import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { OtpInput } from "@proteus-ui/core";

const meta = {
  title: "Components/OtpInput",
  component: OtpInput,
  parameters: {
    docs: {
      description: {
        component: "One-time code, one character per cell. `onComplete` fires when every cell is filled.",
      },
    },
  },
  args: {
    defaultValue: "",
    otpLength: 6,
    disabled: false,
    invalid: false,
    onChange: fn(),
    onComplete: fn(),
  },
  argTypes: {
    defaultValue: { control: "text" },
    otpLength: { control: "number" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    errorMessage: { control: "text" },
    shouldAutoFocus: { control: "boolean" },
    ariaLabel: { control: "text" },
    className: { control: false },
    classNames: { control: false },
    onValidate: { control: false },
    onBlur: { control: false },
  },
} satisfies Meta<typeof OtpInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "123" },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: "123456",
    errorMessage: "Invalid verification code",
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "123456" },
};
