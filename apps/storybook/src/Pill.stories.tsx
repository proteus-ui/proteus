import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pill } from "@proteus-ui/core";

const meta = {
  title: "Components/Pill",
  component: Pill,
  args: {
    children: "Pill",
    intent: "neutral",
  },
  argTypes: {
    intent: { control: "select", options: ["neutral", "primary", "danger"] },
    children: { control: "text" },
  },
} satisfies Meta<typeof Pill>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = {
  args: { intent: "primary" },
};
