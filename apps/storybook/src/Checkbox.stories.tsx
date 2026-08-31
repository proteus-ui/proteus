import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "@proteus-ui/core";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: {
    label: "Remote",
    defaultChecked: false,
    invalid: false,
    disabled: false,
    indeterminate: false,
  },
  argTypes: {
    label: { control: "text" },
    defaultChecked: { control: "boolean" },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    indeterminate: { control: "boolean" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: "All sources" },
};

export const Invalid: Story = {
  args: { invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
};
