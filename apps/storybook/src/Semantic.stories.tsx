import type { Meta, StoryObj } from "@storybook/react-vite";
import { Semantic, Text } from "@proteus-ui/core";

const meta = {
  title: "Semantic/Composition",
  component: Semantic.Main,
  parameters: {
    docs: {
      description: {
        component:
          "Namespace of landmark and document tags (`Semantic.Main`, `Semantic.Nav`, `Semantic.Details`, …). `Semantic` itself does not render. Distinct from the compound `Section` (Title/Body molecule) and `PageFrame` (app chrome).",
      },
    },
  },
} satisfies Meta<typeof Semantic.Main>;

export default meta;

type Story = StoryObj;

export const Landmarks: Story = {
  render: () => (
    <Semantic.Main>
      <Semantic.Header>
        <Text.H2>Semantic.Header</Text.H2>
      </Semantic.Header>
      <Semantic.Nav aria-label="Example">
        <Text.P>Semantic.Nav</Text.P>
      </Semantic.Nav>
      <Semantic.Aside aria-label="Sidebar">
        <Text.P>Semantic.Aside</Text.P>
      </Semantic.Aside>
      <Semantic.Footer>
        <Text.P>Semantic.Footer</Text.P>
      </Semantic.Footer>
    </Semantic.Main>
  ),
};

export const SectionAndArticle: Story = {
  render: () => (
    <>
      <Semantic.Section aria-label="Example section">
        <Text.H3>Semantic.Section</Text.H3>
        <Text.P>Thin section landmark — not the compound Section.Title / Section.Body API.</Text.P>
      </Semantic.Section>
      <Semantic.Article>
        <Text.H3>Semantic.Article</Text.H3>
        <Text.P>Standalone article content.</Text.P>
      </Semantic.Article>
    </>
  ),
};

export const Details: Story = {
  render: () => (
    <Semantic.Details>
      <Semantic.Summary>Semantic.Summary</Semantic.Summary>
      <Text.P>Revealed when the disclosure is open.</Text.P>
    </Semantic.Details>
  ),
};
