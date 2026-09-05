import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageLoader } from "@proteus-ui/core";

const meta = {
  title: "Components/PageLoader",
  component: PageLoader,
  parameters: {
    docs: {
      description: {
        component: "Full-area loading state with a visible label.",
      },
    },
  },
  args: {
    label: "Loading",
  },
  argTypes: {
    label: { control: "text" },
  },
} satisfies Meta<typeof PageLoader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomLabel: Story = {
  args: { label: "Loading page…" },
};
