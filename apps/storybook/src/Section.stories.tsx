import type { Meta, StoryObj } from "@storybook/react-vite";
import { Section } from "@proteus-ui/core";

const meta = {
  title: "Components/Section",
  component: Section,
} satisfies Meta<typeof Section>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Section>
      <Section.Title>Section title</Section.Title>
      <Section.Body>Section body</Section.Body>
    </Section>
  ),
};

export const Untitled: Story = {
  render: () => (
    <Section>
      <Section.Body>Section body</Section.Body>
    </Section>
  ),
};
