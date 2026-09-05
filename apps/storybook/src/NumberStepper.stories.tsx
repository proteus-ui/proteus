import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { NumberStepper } from "@proteus-ui/core";

const meta = {
  title: "Components/NumberStepper",
  component: NumberStepper,
  parameters: {
    docs: {
      description: {
        component: "Numeric value with increment and decrement. Value uses `onValueChange`.",
      },
    },
  },
  args: {
    defaultValue: 0,
    min: 0,
    max: 10,
    step: 1,
    disabled: false,
    invalid: false,
    onValueChange: fn(),
  },
  argTypes: {
    defaultValue: { control: "number" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    label: { control: "text" },
    classNames: { control: false },
  },
} satisfies Meta<typeof NumberStepper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: 12 },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 3 },
};
