import type { Meta, StoryObj } from "@storybook/react-vite";
import { LinkCard } from "@proteus-ui/core";

const meta = {
  title: "Components/LinkCard",
  component: LinkCard,
  args: {
    href: "#",
    title: "Link card",
    children: "Card body",
  },
  argTypes: {
    href: { control: "text" },
    title: { control: "text" },
    children: { control: "text" },
  },
} satisfies Meta<typeof LinkCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Untitled: Story = {
  args: { title: undefined },
};
