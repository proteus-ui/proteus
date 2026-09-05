import type { TextTag } from "./types";

export const TEXT_CLASS = {
  root: "pr-text",
} as const;

export const TEXT_VOID = new Set<TextTag>(["br", "wbr"]);

export const TEXT_DISPLAY_NAME = {
  h1: "TextH1",
  h2: "TextH2",
  h3: "TextH3",
  h4: "TextH4",
  h5: "TextH5",
  h6: "TextH6",
  p: "TextP",
  pre: "TextPre",
  blockquote: "TextBlockquote",
  a: "TextA",
  em: "TextEm",
  strong: "TextStrong",
  small: "TextSmall",
  s: "TextS",
  cite: "TextCite",
  q: "TextQ",
  dfn: "TextDfn",
  abbr: "TextAbbr",
  data: "TextData",
  time: "TextTime",
  code: "TextCode",
  var: "TextVar",
  samp: "TextSamp",
  kbd: "TextKbd",
  sub: "TextSub",
  sup: "TextSup",
  i: "TextI",
  b: "TextB",
  u: "TextU",
  mark: "TextMark",
  bdi: "TextBdi",
  bdo: "TextBdo",
  span: "TextSpan",
  br: "TextBr",
  wbr: "TextWbr",
} as const satisfies Record<TextTag, string>;
