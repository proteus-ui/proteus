import type { Meta, StoryObj } from "@storybook/react-vite";
import { CollapsibleSection } from "@proteus-ui/core";

const meta = {
  title: "Components/CollapsibleSection",
  component: CollapsibleSection,
  parameters: {
    docs: {
      description: {
        component:
          "Expandable items. `mode` is `single` or `multiple`. Each child is a `CollapsibleSection.Item`.",
      },
    },
  },
  argTypes: {
    mode: { control: "select", options: ["single", "multiple"] },
    openIds: { control: false },
  },
} satisfies Meta<typeof CollapsibleSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { mode: "single" },
  render: (args) => (
    <CollapsibleSection {...args}>
      <CollapsibleSection.Item id="a">
        <CollapsibleSection.Title>First</CollapsibleSection.Title>
        <CollapsibleSection.Panel>Panel A</CollapsibleSection.Panel>
      </CollapsibleSection.Item>
      <CollapsibleSection.Item id="b">
        <CollapsibleSection.Title>Second</CollapsibleSection.Title>
        <CollapsibleSection.Panel>Panel B</CollapsibleSection.Panel>
      </CollapsibleSection.Item>
    </CollapsibleSection>
  ),
};

export const Open: Story = {
  args: { mode: "single" },
  render: (args) => (
    <CollapsibleSection {...args}>
      <CollapsibleSection.Item id="a" defaultOpen>
        <CollapsibleSection.Title>First</CollapsibleSection.Title>
        <CollapsibleSection.Panel>Panel A</CollapsibleSection.Panel>
      </CollapsibleSection.Item>
      <CollapsibleSection.Item id="b">
        <CollapsibleSection.Title>Second</CollapsibleSection.Title>
        <CollapsibleSection.Panel>Panel B</CollapsibleSection.Panel>
      </CollapsibleSection.Item>
    </CollapsibleSection>
  ),
};
