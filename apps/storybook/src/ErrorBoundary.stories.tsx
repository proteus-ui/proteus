import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ErrorBoundary } from "@proteus-ui/core";

function ThrowOnce() {
  throw new Error("story error");
}

const meta = {
  title: "Components/ErrorBoundary",
  component: ErrorBoundary,
  parameters: {
    docs: {
      description: {
        component: "Catches render errors in its children and shows `fallback`.",
      },
    },
  },
  args: {
    children: "Content inside the boundary",
  },
  argTypes: {
    children: { control: "text" },
    fallback: { control: false },
  },
} satisfies Meta<typeof ErrorBoundary>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Fallback: Story = {
  args: {
    fallback: (
      <div className="pr-error-boundary" role="alert">
        Something went wrong
      </div>
    ),
  },
  render: function FallbackRender(args) {
    const [explode, setExplode] = useState(false);
    return (
      <ErrorBoundary fallback={args.fallback} onError={args.onError}>
        <button type="button" onClick={() => setExplode(true)}>
          Trigger error
        </button>
        {explode ? <ThrowOnce /> : null}
      </ErrorBoundary>
    );
  },
};
