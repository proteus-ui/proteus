import type { Meta, StoryObj } from "@storybook/react-vite";
import { Semantic, Text } from "@proteus-ui/core";

const meta = {
  title: "Semantic/Article",
  component: Semantic.Article,
  parameters: {
    docs: {
      description: { component: "Standalone `<article>` landmark for self-contained content." },
    },
  },
} satisfies Meta<typeof Semantic.Article>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <Text.H3>Title</Text.H3>
        <Text.P>Article body</Text.P>
      </>
    ),
  },
};
