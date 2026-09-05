import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Tooltip } from "@proteus-ui/core";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component:
          "Short hint shown on hover or focus. Compose with `Tooltip.Trigger` and `Tooltip.Content`.",
      },
    },
  },
  args: {
    delay: 0,
    placement: "top",
  },
  argTypes: {
    delay: { control: "number" },
    placement: { control: "select", options: ["top", "bottom", "left", "right"] },
    children: { control: false },
    classNames: { control: false },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Tooltip.Trigger>
        <Button>Hover me</Button>
      </Tooltip.Trigger>
      <Tooltip.Content>Helpful tip</Tooltip.Content>
    </Tooltip>
  ),
};

export const Bottom: Story = {
  args: { placement: "bottom" },
  render: (args) => (
    <Tooltip {...args}>
      <Tooltip.Trigger>
        <Button>Hover me</Button>
      </Tooltip.Trigger>
      <Tooltip.Content>Shown below</Tooltip.Content>
    </Tooltip>
  ),
};

export const LongContent: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Tooltip.Trigger>
        <Button>Hover me</Button>
      </Tooltip.Trigger>
      <Tooltip.Content>This tooltip has a longer message for layout checks.</Tooltip.Content>
    </Tooltip>
  ),
};
