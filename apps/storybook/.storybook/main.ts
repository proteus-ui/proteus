import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const configDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(configDir, "../../..");

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs"],
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      resolve: {
        alias: [
          {
            find: "@proteus-ui/core/styles.css",
            replacement: join(repoRoot, "packages/core/src/styles.css"),
          },
          {
            find: "@proteus-ui/core",
            replacement: join(repoRoot, "packages/core/src/index.ts"),
          },
        ],
      },
      server: {
        fs: { allow: [repoRoot] },
      },
    });
  },
};

export default config;
