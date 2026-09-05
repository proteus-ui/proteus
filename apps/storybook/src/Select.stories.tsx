import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef } from "react";
import { fn } from "storybook/test";
import { Select } from "@proteus-ui/core";

const options = [
  { value: "apple", label: "Apple" },
  { value: "apricot", label: "Apricot" },
  { value: "banana", label: "Banana" },
] as const;

const meta = {
  title: "Components/Select",
  component: Select,
  parameters: {
    docs: {
      description: {
        component: "Choose one option from a list. Selection uses `value` / `onValueChange`.",
      },
    },
  },
  args: {
    options,
    placeholder: "Choose a fruit…",
    disabled: false,
    invalid: false,
    onValueChange: fn(),
  },
  argTypes: {
    options: { control: false },
    defaultValue: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    label: { control: "text" },
    classNames: { control: false },
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  render: function OpenRender(args) {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      containerRef.current
        ?.querySelector<HTMLInputElement>('[role="combobox"]')
        ?.focus();
    }, []);
    return (
      <div ref={containerRef}>
        <Select {...args} />
      </div>
    );
  },
};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: "apple" },
};
