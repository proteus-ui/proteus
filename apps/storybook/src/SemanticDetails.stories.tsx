import type { Meta, StoryObj } from "@storybook/react-vite";
import { Semantic, Text } from "@proteus-ui/core";

const meta = {
  title: "Semantic/Details",
  component: Semantic.Details,
  parameters: {
    docs: {
      description: {
        component:
          "Native disclosure `<details>`. Pair with `Semantic.Summary` as the first child.",
      },
    },
  },
} satisfies Meta<typeof Semantic.Details>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Semantic.Details>
      <Semantic.Summary>More information</Semantic.Summary>
      <Text.P>Expanded content.</Text.P>
    </Semantic.Details>
  ),
};
