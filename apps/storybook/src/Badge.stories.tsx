import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@proteus-ui/core";

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    docs: {
      description: {
        component: "Compact status label. Use Pill when you want a fully rounded shape.",
      },
    },
  },
  args: {
    children: "Badge",
    intent: "neutral",
  },
  argTypes: {
    intent: {
      control: "select",
      options: ["neutral", "primary", "danger", "success", "warning"],
    },
    children: { control: "text" },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = {
  args: { intent: "primary" },
};

export const Danger: Story = {
  args: { intent: "danger" },
};

export const Success: Story = {
  args: { intent: "success", children: "Ok" },
};

export const Warning: Story = {
  args: { intent: "warning", children: "Retry" },
};
