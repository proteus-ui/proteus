import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextInput } from "@proteus-ui/core";

const meta = {
  title: "Components/TextInput",
  component: TextInput,
  parameters: {
    docs: {
      description: {
        component:
          "Single-line text field. Value is controlled with `value` / `onValueChange`, not native `onChange`.",
      },
    },
  },
  args: {
    defaultValue: "",
    placeholder: "Type…",
    invalid: false,
    disabled: false,
  },
  argTypes: {
    defaultValue: { control: "text" },
    placeholder: { control: "text" },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: "bad" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "locked" },
};
