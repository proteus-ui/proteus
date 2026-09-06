import type { Meta, StoryObj } from "@storybook/react-vite";
import { Semantic, Text } from "@proteus-ui/core";

const meta = {
  title: "Semantic/Main",
  component: Semantic.Main,
  parameters: {
    docs: {
      description: { component: "Document `<main>` landmark. Prefer one per page." },
    },
  },
} satisfies Meta<typeof Semantic.Main>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: <Text.P>Main content</Text.P> },
};
