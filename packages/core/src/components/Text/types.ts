import type { JSX } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type TextTag =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "pre"
  | "blockquote"
  | "a"
  | "em"
  | "strong"
  | "small"
  | "s"
  | "cite"
  | "q"
  | "dfn"
  | "abbr"
  | "data"
  | "time"
  | "code"
  | "var"
  | "samp"
  | "kbd"
  | "sub"
  | "sup"
  | "i"
  | "b"
  | "u"
  | "mark"
  | "bdi"
  | "bdo"
  | "span"
  | "br"
  | "wbr";

export type TextSlot = "root";

type VoidTextTag = "br" | "wbr";

export type TextProps<T extends TextTag = TextTag> = (T extends VoidTextTag
  ? Omit<JSX.IntrinsicElements[T], "children">
  : JSX.IntrinsicElements[T]) & {
  /** Per-slot class names (`root`). */
  classNames?: SlotClassNames<TextSlot>;
};

export type TextH1Props = TextProps<"h1">;
export type TextH2Props = TextProps<"h2">;
export type TextH3Props = TextProps<"h3">;
export type TextH4Props = TextProps<"h4">;
export type TextH5Props = TextProps<"h5">;
export type TextH6Props = TextProps<"h6">;
export type TextPProps = TextProps<"p">;
export type TextPreProps = TextProps<"pre">;
export type TextBlockquoteProps = TextProps<"blockquote">;
export type TextAProps = TextProps<"a">;
export type TextEmProps = TextProps<"em">;
export type TextStrongProps = TextProps<"strong">;
export type TextSmallProps = TextProps<"small">;
export type TextSProps = TextProps<"s">;
export type TextCiteProps = TextProps<"cite">;
export type TextQProps = TextProps<"q">;
export type TextDfnProps = TextProps<"dfn">;
export type TextAbbrProps = TextProps<"abbr">;
export type TextDataProps = TextProps<"data">;
export type TextTimeProps = TextProps<"time">;
export type TextCodeProps = TextProps<"code">;
export type TextVarProps = TextProps<"var">;
export type TextSampProps = TextProps<"samp">;
export type TextKbdProps = TextProps<"kbd">;
export type TextSubProps = TextProps<"sub">;
export type TextSupProps = TextProps<"sup">;
export type TextIProps = TextProps<"i">;
export type TextBProps = TextProps<"b">;
export type TextUProps = TextProps<"u">;
export type TextMarkProps = TextProps<"mark">;
export type TextBdiProps = TextProps<"bdi">;
export type TextBdoProps = TextProps<"bdo">;
export type TextSpanProps = TextProps<"span">;
export type TextBrProps = TextProps<"br">;
export type TextWbrProps = TextProps<"wbr">;
