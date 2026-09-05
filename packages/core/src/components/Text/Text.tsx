import { createElement, forwardRef } from "react";
import { cn } from "../../utils/cn";
import { TEXT_CLASS, TEXT_DISPLAY_NAME, TEXT_VOID } from "./consts";
import type { TextProps, TextTag } from "./types";

function createText<T extends TextTag>(tag: T) {
  const Comp = forwardRef<HTMLElementTagNameMap[T], TextProps<T>>(
    function TextMember(props, ref) {
      const { className, classNames, children, ...rest } = props as TextProps<T> & {
        children?: never;
      };
      return createElement(
        tag,
        {
          ...rest,
          ref,
          className: cn(TEXT_CLASS.root, classNames?.root, className),
          "data-tag": tag,
        },
        TEXT_VOID.has(tag) ? undefined : children,
      );
    },
  );
  Comp.displayName = TEXT_DISPLAY_NAME[tag];
  return Comp;
}

export const TextH1 = createText("h1");
export const TextH2 = createText("h2");
export const TextH3 = createText("h3");
export const TextH4 = createText("h4");
export const TextH5 = createText("h5");
export const TextH6 = createText("h6");
export const TextP = createText("p");
export const TextPre = createText("pre");
export const TextBlockquote = createText("blockquote");
export const TextA = createText("a");
export const TextEm = createText("em");
export const TextStrong = createText("strong");
export const TextSmall = createText("small");
export const TextS = createText("s");
export const TextCite = createText("cite");
export const TextQ = createText("q");
export const TextDfn = createText("dfn");
export const TextAbbr = createText("abbr");
export const TextData = createText("data");
export const TextTime = createText("time");
export const TextCode = createText("code");
export const TextVar = createText("var");
export const TextSamp = createText("samp");
export const TextKbd = createText("kbd");
export const TextSub = createText("sub");
export const TextSup = createText("sup");
export const TextI = createText("i");
export const TextB = createText("b");
export const TextU = createText("u");
export const TextMark = createText("mark");
export const TextBdi = createText("bdi");
export const TextBdo = createText("bdo");
export const TextSpan = createText("span");
export const TextBr = createText("br");
export const TextWbr = createText("wbr");

export const Text = Object.freeze({
  H1: TextH1,
  H2: TextH2,
  H3: TextH3,
  H4: TextH4,
  H5: TextH5,
  H6: TextH6,
  P: TextP,
  Pre: TextPre,
  Blockquote: TextBlockquote,
  A: TextA,
  Em: TextEm,
  Strong: TextStrong,
  Small: TextSmall,
  S: TextS,
  Cite: TextCite,
  Q: TextQ,
  Dfn: TextDfn,
  Abbr: TextAbbr,
  Data: TextData,
  Time: TextTime,
  Code: TextCode,
  Var: TextVar,
  Samp: TextSamp,
  Kbd: TextKbd,
  Sub: TextSub,
  Sup: TextSup,
  I: TextI,
  B: TextB,
  U: TextU,
  Mark: TextMark,
  Bdi: TextBdi,
  Bdo: TextBdo,
  Span: TextSpan,
  Br: TextBr,
  Wbr: TextWbr,
});
