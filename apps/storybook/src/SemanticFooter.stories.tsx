import type { Meta, StoryObj } from "@storybook/react-vite";
import { Semantic, Text } from "@proteus-ui/core";

const meta = {
  title: "Semantic/Footer",
  component: Semantic.Footer,
  parameters: {
    docs: {
      description: { component: "Page or section `<footer>` landmark." },
    },
  },
} satisfies Meta<typeof Semantic.Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: <Text.P>Footer</Text.P> },
};
