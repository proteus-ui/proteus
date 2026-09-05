import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { InlineEditControls } from "@proteus-ui/core";

const meta = {
  title: "Components/InlineEditControls",
  component: InlineEditControls,
  parameters: {
    docs: {
      description: {
        component: "Edit, save, and cancel controls for an inline-edit surface.",
      },
    },
  },
  args: {
    editing: false,
    onEdit: fn(),
    onSave: fn(),
    onCancel: fn(),
  },
  argTypes: {
    editing: { control: "boolean" },
  },
} satisfies Meta<typeof InlineEditControls>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Editing: Story = {
  args: { editing: true },
};
