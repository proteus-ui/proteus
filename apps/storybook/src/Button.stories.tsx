import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@proteus-ui/core";

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Button",
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
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = {
  args: { intent: "primary" },
};

export const Danger: Story = {
  args: { intent: "danger" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithIcon: Story = {
  args: { icon: <span>★</span>, children: "With icon" },
};
