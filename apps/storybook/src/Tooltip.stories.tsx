import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Tooltip } from "@proteus-ui/core";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  args: {
    content: "Helpful tip",
    delay: 0,
    placement: "top",
    children: <Button>Hover me</Button>,
  },
  argTypes: {
    content: { control: "text" },
    delay: { control: "number" },
    placement: { control: "select", options: ["top", "bottom", "left", "right"] },
    children: { control: false },
    classNames: { control: false },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Bottom: Story = {
  args: { placement: "bottom", content: "Shown below" },
};

export const LongContent: Story = {
  args: {
    content: "This tooltip has a longer message for layout checks.",
  },
};
