import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "@proteus-ui/core";

const meta = {
  title: "Components/Text",
  component: Text.P,
  parameters: {
    docs: {
      description: {
        component:
          "Namespace of HTML text tags (`Text.H1`, `Text.P`, `Text.Span`, …). `Text` itself does not render. Each member is a thin tag with `classNames.root`. The API table below is for `Text.P`; other members share the same extras.",
      },
    },
  },
} satisfies Meta<typeof Text.P>;

export default meta;

type Story = StoryObj;

export const Scale: Story = {
  render: () => (
    <>
      <Text.H1>Text.H1</Text.H1>
      <Text.H2>Text.H2</Text.H2>
      <Text.H3>Text.H3</Text.H3>
      <Text.H4>Text.H4</Text.H4>
      <Text.H5>Text.H5</Text.H5>
      <Text.H6>Text.H6</Text.H6>
      <Text.P>Text.P</Text.P>
    </>
  ),
};

export const Blocks: Story = {
  render: () => (
    <>
      <Text.P>Text.P — paragraph body.</Text.P>
      <Text.Blockquote>Text.Blockquote — a quoted passage.</Text.Blockquote>
      <Text.Pre>{`Text.Pre — preformatted
  line two`}</Text.Pre>
    </>
  ),
};

export const Phrasing: Story = {
  render: () => (
    <Text.P>
      Text.Span: <Text.Span>inline span</Text.Span>
      <Text.Br />
      Text.A: <Text.A href="#scale">a link</Text.A>
      <Text.Br />
      Text.Strong: <Text.Strong>strong</Text.Strong>
      <Text.Br />
      Text.B: <Text.B>b</Text.B>
      <Text.Br />
      Text.Em: <Text.Em>emphasis</Text.Em>
      <Text.Br />
      Text.I: <Text.I>italic</Text.I>
      <Text.Br />
      Text.Small: <Text.Small>small</Text.Small>
      <Text.Br />
      Text.S: <Text.S>struck</Text.S>
      <Text.Br />
      Text.U: <Text.U>underline</Text.U>
      <Text.Br />
      Text.Mark: <Text.Mark>mark</Text.Mark>
      <Text.Br />
      Text.Cite: <Text.Cite>Citation</Text.Cite>
      <Text.Br />
      Text.Q: <Text.Q>quoted</Text.Q>
      <Text.Br />
      Text.Dfn: <Text.Dfn>definition</Text.Dfn>
      <Text.Br />
      Text.Abbr: <Text.Abbr title="HyperText Markup Language">HTML</Text.Abbr>
      <Text.Br />
      Text.Data: <Text.Data value="42">forty-two</Text.Data>
      <Text.Br />
      Text.Time: <Text.Time dateTime="2026-09-05">5 Sep 2026</Text.Time>
      <Text.Br />
      Text.Code: <Text.Code>code</Text.Code>
      <Text.Br />
      Text.Kbd: <Text.Kbd>Ctrl</Text.Kbd> + <Text.Kbd>K</Text.Kbd>
      <Text.Br />
      Text.Samp: <Text.Samp>sample output</Text.Samp>
      <Text.Br />
      Text.Var: <Text.Var>x</Text.Var>
      <Text.Br />
      Text.Sub: H<Text.Sub>2</Text.Sub>O
      <Text.Br />
      Text.Sup: x<Text.Sup>2</Text.Sup>
      <Text.Br />
      Text.Bdi: <Text.Bdi>مستقل</Text.Bdi>
      <Text.Br />
      Text.Bdo: <Text.Bdo dir="rtl">reversed</Text.Bdo>
    </Text.P>
  ),
};

export const Breaks: Story = {
  render: () => (
    <Text.P>
      Text.Br between lines
      <Text.Br />
      second line.
      <Text.Br />
      Text.Wbr in a long token: supercalifragilistic
      <Text.Wbr />
      expialidocious
    </Text.P>
  ),
};
