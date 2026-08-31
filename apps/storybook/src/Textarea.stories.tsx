import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "@proteus-ui/core";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  args: {
    defaultValue: "",
    placeholder: "Notes…",
    invalid: false,
    disabled: false,
    rows: 3,
  },
  argTypes: {
    defaultValue: { control: "text" },
    placeholder: { control: "text" },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    rows: { control: "number" },
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "Keyword one\nKeyword two" },
};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: "too short" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "locked" },
};
