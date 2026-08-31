import type { Meta, StoryObj } from "@storybook/react-vite";
import { OutlineButton } from "@proteus-ui/core";

const meta = {
  title: "Components/OutlineButton",
  component: OutlineButton,
  args: {
    children: "Outline",
    intent: "neutral",
    size: "md",
    disabled: false,
  },
  argTypes: {
    intent: { control: "select", options: ["neutral", "primary", "danger"] },
    size: { control: "select", options: ["sm", "md"] },
    disabled: { control: "boolean" },
    children: { control: "text" },
    icon: { control: false },
  },
} satisfies Meta<typeof OutlineButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = {
  args: { intent: "primary" },
};
