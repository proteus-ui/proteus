import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Dialog } from "@proteus-ui/core";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  args: {
    open: false,
    title: "Dialog title",
    children: "Dialog body",
    onClose: fn(),
  },
  argTypes: {
    open: { control: "boolean" },
    title: { control: "text" },
    children: { control: "text" },
  },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: { open: false },
};

export const Open: Story = {
  args: { open: true },
};
