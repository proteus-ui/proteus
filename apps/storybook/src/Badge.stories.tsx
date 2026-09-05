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
    intent: { control: "select", options: ["neutral", "primary", "danger"] },
    children: { control: "text" },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = {
  args: { intent: "primary" },
};
