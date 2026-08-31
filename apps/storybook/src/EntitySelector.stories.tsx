import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef } from "react";
import { fn } from "storybook/test";
import { EntitySelector } from "@proteus-ui/core";

const suggestions = [
  { value: "ent-1", label: "Acme Corp" },
  { value: "ent-2", label: "Globex Inc" },
  { value: "ent-3", label: "Initech" },
] as const;

const meta = {
  title: "Components/EntitySelector",
  component: EntitySelector,
  args: {
    label: "Entity",
    defaultValue: "",
    placeholder: "Search entities…",
    suggestions,
    disabled: false,
    isLoading: false,
    invalid: false,
    onValueChange: fn(),
    onEntitySelect: fn(),
    onSuggestionSelect: fn(),
    onClear: fn(),
  },
  argTypes: {
    label: { control: "text" },
    defaultValue: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    isLoading: { control: "boolean" },
    invalid: { control: "boolean" },
    errorMessage: { control: "text" },
    hintMessage: { control: "text" },
    suggestions: { control: false },
    classNames: { control: false },
    toggleIcon: { control: false },
    onEntitySelect: { control: false },
  },
} satisfies Meta<typeof EntitySelector>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: { defaultValue: "ac" },
  render: function OpenRender(args) {
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => {
      ref.current?.focus();
    }, []);
    return <EntitySelector ref={ref} {...args} />;
  },
};

export const Loading: Story = {
  args: { defaultValue: "ac", isLoading: true },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: "unknown",
    errorMessage: "Select a valid entity",
  },
};
