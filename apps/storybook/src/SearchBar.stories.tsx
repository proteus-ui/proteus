import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { SearchBar } from "@proteus-ui/core";

const meta = {
  title: "Components/SearchBar",
  component: SearchBar,
  args: {
    defaultValue: "",
    placeholder: "Search…",
    disabled: false,
    onClear: fn(),
  },
  argTypes: {
    defaultValue: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof SearchBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "query" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "query" },
};
