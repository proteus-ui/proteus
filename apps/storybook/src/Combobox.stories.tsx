import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef } from "react";
import { fn } from "storybook/test";
import { Combobox } from "@proteus-ui/core";

const suggestions = [
  { value: "apple", label: "Apple" },
  { value: "apricot", label: "Apricot" },
  { value: "banana", label: "Banana" },
] as const;

const meta = {
  title: "Components/Combobox",
  component: Combobox,
  args: {
    defaultValue: "",
    placeholder: "Search fruits…",
    suggestions,
    disabled: false,
    isLoading: false,
    invalid: false,
    onValueChange: fn(),
    onSuggestionSelect: fn(),
    onClear: fn(),
  },
  argTypes: {
    defaultValue: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    isLoading: { control: "boolean" },
    invalid: { control: "boolean" },
    errorMessage: { control: "text" },
    hintMessage: { control: "text" },
    label: { control: "text" },
    suggestions: { control: false },
    classNames: { control: false },
    toggleIcon: { control: false },
  },
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: { defaultValue: "ap" },
  render: function OpenRender(args) {
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => {
      ref.current?.focus();
    }, []);
    return <Combobox ref={ref} {...args} />;
  },
};

export const Loading: Story = {
  args: { defaultValue: "ap", isLoading: true },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: "bad",
    errorMessage: "Pick a fruit from the list",
  },
};
