import type { Meta, StoryObj } from "@storybook/react-vite";
import { Semantic, Text } from "@proteus-ui/core";

const meta = {
  title: "Semantic/Header",
  component: Semantic.Header,
  parameters: {
    docs: {
      description: { component: "Page or section `<header>` landmark." },
    },
  },
} satisfies Meta<typeof Semantic.Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: <Text.P>Header</Text.P> },
};
