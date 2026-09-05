import "@proteus-ui/tokens/tokens.css";
import "@proteus-ui/theme-default/tokens.css";
import "@proteus-ui/core/styles.css";
import "@proteus-ui/theme-default/theme.css";
import {
  ArgTypes,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    options: {
      storySort: {
        order: ["Getting started", "Components"],
      },
    },
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <h2>Overview</h2>
          <Description />
          <Primary />
          <h2>Component API</h2>
          <ArgTypes />
          <Stories />
        </>
      ),
    },
  },
};

export default preview;
