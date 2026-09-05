import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "@proteus-ui/core";

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: {
    docs: {
      description: {
        component:
          "Content container. Compose with `Card.Title`, `Card.Body`, and optional `Card.Footer`.",
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card>
      <Card.Title>Card title</Card.Title>
      <Card.Body>Card body</Card.Body>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card>
      <Card.Title>Card title</Card.Title>
      <Card.Body>Card body</Card.Body>
      <Card.Footer>Card footer</Card.Footer>
    </Card>
  ),
};
