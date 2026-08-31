import type { Meta, StoryObj } from "@storybook/react-vite";
import { CollapsibleSection } from "@proteus-ui/core";

const items = [
  { id: "a", title: "First", children: "Panel A" },
  { id: "b", title: "Second", children: "Panel B" },
] as const;

const meta = {
  title: "Components/CollapsibleSection",
  component: CollapsibleSection,
  args: {
    items,
    mode: "single",
  },
  argTypes: {
    mode: { control: "select", options: ["single", "multiple"] },
    items: { control: false },
    openIds: { control: false },
  },
} satisfies Meta<typeof CollapsibleSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: {
    items: [
      { id: "a", title: "First", children: "Panel A", defaultOpen: true },
      { id: "b", title: "Second", children: "Panel B" },
    ],
  },
};
