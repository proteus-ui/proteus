import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toolbar, ToolbarButton } from "@proteus-ui/core";

const meta = {
  title: "Components/Toolbar",
  component: Toolbar,
  parameters: {
    docs: {
      description: {
        component: "Horizontal group of actions. Place `ToolbarButton` children inside.",
      },
    },
  },
} satisfies Meta<typeof Toolbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <ToolbarButton>Cut</ToolbarButton>
        <ToolbarButton>Copy</ToolbarButton>
        <ToolbarButton>Paste</ToolbarButton>
      </>
    ),
  },
};

export const Pressed: Story = {
  args: {
    children: (
      <>
        <ToolbarButton pressed>Bold</ToolbarButton>
        <ToolbarButton>Italic</ToolbarButton>
      </>
    ),
  },
};
