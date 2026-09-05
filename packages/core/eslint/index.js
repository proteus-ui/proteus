import { compoundSlotsRule } from "./compound-slots.js";

const plugin = {
  meta: { name: "@proteus-ui/eslint-plugin", version: "0.0.0" },
  rules: {
    "compound-slots": compoundSlotsRule,
  },
};

plugin.configs = {
  recommended: {
    name: "@proteus-ui/recommended",
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { "@proteus-ui": plugin },
    rules: {
      "@proteus-ui/compound-slots": "error",
    },
  },
};

export default plugin;
