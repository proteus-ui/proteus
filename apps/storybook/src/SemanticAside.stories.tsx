import type { Meta, StoryObj } from "@storybook/react-vite";
import { Semantic, Text } from "@proteus-ui/core";

const meta = {
  title: "Semantic/Aside",
  component: Semantic.Aside,
  parameters: {
    docs: {
      description: {
        component: "Complementary `<aside>` landmark. Name it when the purpose is not obvious.",
      },
    },
  },
  args: { "aria-label": "Related" },
} satisfies Meta<typeof Semantic.Aside>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: <Text.P>Aside</Text.P> },
};
