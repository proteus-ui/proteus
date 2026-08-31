import type { Meta, StoryObj } from "@storybook/react-vite";
import { Section } from "@proteus-ui/core";

const meta = {
  title: "Components/Section",
  component: Section,
  args: {
    title: "Section title",
    children: "Section body",
  },
  argTypes: {
    title: { control: "text" },
    children: { control: "text" },
  },
} satisfies Meta<typeof Section>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Untitled: Story = {
  args: { title: undefined },
};
