import type { Meta, StoryObj } from "@storybook/react-vite";
import { Semantic } from "@proteus-ui/core";

const meta = {
  title: "Semantic/Summary",
  component: Semantic.Summary,
  parameters: {
    docs: {
      description: {
        component: "Disclosure label `<summary>`. Use inside `Semantic.Details`.",
      },
    },
  },
} satisfies Meta<typeof Semantic.Summary>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Semantic.Details>
      <Semantic.Summary>Summary label</Semantic.Summary>
      Panel content
    </Semantic.Details>
  ),
};
