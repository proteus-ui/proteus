import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageFrame } from "@proteus-ui/core";

const meta = {
  title: "Components/PageFrame",
  component: PageFrame,
} satisfies Meta<typeof PageFrame>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <PageFrame>
      <PageFrame.Header>Header</PageFrame.Header>
      <PageFrame.Main>Main content</PageFrame.Main>
      <PageFrame.Footer>Footer</PageFrame.Footer>
    </PageFrame>
  ),
};

export const MainOnly: Story = {
  render: () => (
    <PageFrame>
      <PageFrame.Main>Main content</PageFrame.Main>
    </PageFrame>
  ),
};
