import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@proteus-ui/core";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          "Triggers an action. Use for labeled actions, optionally with a prefix or suffix icon. Icon-only actions should use IconButton.",
      },
    },
  },
  args: {
    children: "Button",
    intent: "neutral",
    size: "md",
    variant: "solid",
    disabled: false,
  },
  argTypes: {
    intent: { control: "select", options: ["neutral", "primary", "danger"] },
    size: { control: "select", options: ["sm", "md"] },
    variant: { control: "select", options: ["solid", "outline", "text"] },
    disabled: { control: "boolean" },
    children: { control: "text" },
    icon: { control: false },
    iconPlacement: { control: "select", options: ["prefix", "suffix"] },
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

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Text: Story = {
  args: { variant: "text", intent: "primary" },
};

export const WithIcon: Story = {
  args: { icon: <span>★</span>, children: "With icon" },
};

export const WithSuffixIcon: Story = {
  args: {
    icon: <span>→</span>,
    iconPlacement: "suffix",
    children: "Continue",
  },
};
