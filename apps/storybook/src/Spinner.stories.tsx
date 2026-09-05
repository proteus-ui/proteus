import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "@proteus-ui/core";

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component: "Indicates an in-progress action. `label` is announced to assistive tech.",
      },
    },
  },
  args: {
    size: "md",
    label: "Loading",
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md"] },
    label: { control: "text" },
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: "sm" },
};
