import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageFrame } from "@proteus-ui/core";

const meta = {
  title: "Components/PageFrame",
  component: PageFrame,
  args: {
    header: "Header",
    children: "Main content",
    footer: "Footer",
  },
  argTypes: {
    header: { control: "text" },
    children: { control: "text" },
    footer: { control: "text" },
  },
} satisfies Meta<typeof PageFrame>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MainOnly: Story = {
  args: { header: undefined, footer: undefined },
};
