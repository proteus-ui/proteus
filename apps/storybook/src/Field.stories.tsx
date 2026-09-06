import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, TextInput, Textarea } from "@proteus-ui/core";

const meta = {
  title: "Components/Field",
  component: Field,
  parameters: {
    docs: {
      description: {
        component:
          "Label + control wrapper. Passes `id` / `aria-describedby` into a single child control. Labels stay associated via `htmlFor`.",
      },
    },
  },
  args: {
    label: "Display name",
    hint: "Shown on your public profile.",
  },
  argTypes: {
    label: { control: "text" },
    hint: { control: "text" },
    error: { control: "text" },
    invalid: { control: "boolean" },
    children: { control: false },
  },
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Field {...args}>
      <TextInput placeholder="Jane Doe" />
    </Field>
  ),
};

export const WithError: Story = {
  args: {
    label: "Bio",
    hint: undefined,
    error: "Keep it under 160 characters.",
    invalid: true,
  },
  render: (args) => (
    <Field {...args}>
      <Textarea rows={3} defaultValue="Too long…" />
    </Field>
  ),
};
