import type { Meta, StoryObj } from "@storybook/react-vite";
import { Semantic, Text } from "@proteus-ui/core";

const meta = {
  title: "Semantic/Section",
  component: Semantic.Section,
  parameters: {
    docs: {
      description: {
        component:
          "Thin `<section>` landmark with `classNames.root`. Not the compound `Section` (Title/Body) molecule under Components.",
      },
    },
  },
  args: { "aria-label": "Example" },
} satisfies Meta<typeof Semantic.Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <Text.H3>Heading</Text.H3>
        <Text.P>Section body</Text.P>
      </>
    ),
  },
};
