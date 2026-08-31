import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TimeInput } from "@proteus-ui/core";

const meta = {
  title: "Components/TimeInput",
  component: TimeInput,
  args: {
    defaultValue: "",
    disabled: false,
    invalid: false,
    onValueChange: fn(),
  },
  argTypes: {
    defaultValue: { control: "text" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    errorMessage: { control: "text" },
    label: { control: "text" },
    classNames: { control: false },
  },
} satisfies Meta<typeof TimeInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "09:30" },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: "25:99",
    errorMessage: "Enter a valid time (HH:MM)",
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "14:00" },
};
