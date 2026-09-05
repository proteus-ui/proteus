import type { Meta, StoryObj } from "@storybook/react-vite";
import { LinkCard } from "@proteus-ui/core";

const meta = {
  title: "Components/LinkCard",
  component: LinkCard,
} satisfies Meta<typeof LinkCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <LinkCard href="#">
      <LinkCard.Title>Link card</LinkCard.Title>
      <LinkCard.Body>Card body</LinkCard.Body>
    </LinkCard>
  ),
};

export const Untitled: Story = {
  render: () => (
    <LinkCard href="#">
      <LinkCard.Body>Card body</LinkCard.Body>
    </LinkCard>
  ),
};
