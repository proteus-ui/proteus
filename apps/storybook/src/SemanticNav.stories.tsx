import type { Meta, StoryObj } from "@storybook/react-vite";
import { Semantic, Text } from "@proteus-ui/core";

const meta = {
  title: "Semantic/Nav",
  component: Semantic.Nav,
  parameters: {
    docs: {
      description: {
        component: "Navigation `<nav>` landmark. Give it an accessible name when several exist.",
      },
    },
  },
  args: { "aria-label": "Primary" },
} satisfies Meta<typeof Semantic.Nav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: <Text.P>Nav links</Text.P> },
};
