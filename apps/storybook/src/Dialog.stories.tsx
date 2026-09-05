import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Dialog } from "@proteus-ui/core";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  parameters: {
    docs: {
      description: {
        component:
          "Modal dialog that traps focus while open. Compose with `Dialog.Title`, `Dialog.Body`, and `Dialog.Actions`.",
      },
    },
  },
  args: {
    open: false,
    onClose: fn(),
  },
  argTypes: {
    open: { control: "boolean" },
  },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: { open: false },
  render: (args) => (
    <Dialog {...args}>
      <Dialog.Title>Dialog title</Dialog.Title>
      <Dialog.Body>Dialog body</Dialog.Body>
    </Dialog>
  ),
};

export const Open: Story = {
  args: { open: true },
  render: (args) => (
    <Dialog {...args}>
      <Dialog.Title>Dialog title</Dialog.Title>
      <Dialog.Body>Dialog body</Dialog.Body>
    </Dialog>
  ),
};
