import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton } from "@proteus-ui/core";

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  args: {
    "aria-label": "Star",
    icon: <span>★</span>,
    intent: "neutral",
    size: "md",
    disabled: false,
  },
  argTypes: {
    intent: { control: "select", options: ["neutral", "primary", "danger"] },
    size: { control: "select", options: ["sm", "md"] },
    disabled: { control: "boolean" },
    icon: { control: false },
    children: { table: { disable: true } },
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true, "aria-label": "Star (disabled)" },
};
