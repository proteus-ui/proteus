import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "@proteus-ui/core";

const meta = {
  title: "Components/Card",
  component: Card,
  args: {
    title: "Card title",
    children: "Card body",
  },
  argTypes: {
    title: { control: "text" },
    children: { control: "text" },
    footer: { control: "text" },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFooter: Story = {
  args: { footer: "Card footer" },
};
