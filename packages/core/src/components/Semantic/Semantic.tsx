import { createElement, forwardRef } from "react";
import { cn } from "../../utils/cn";
import { SEMANTIC_CLASS, SEMANTIC_DISPLAY_NAME } from "./consts";
import type { SemanticProps, SemanticTag } from "./types";

function createSemantic<T extends SemanticTag>(tag: T) {
  const Comp = forwardRef<HTMLElementTagNameMap[T], SemanticProps<T>>(
    function SemanticMember(props, ref) {
      const { className, classNames, children, ...rest } = props as SemanticProps<T> & {
        children?: never;
      };
      return createElement(
        tag,
        {
          ...rest,
          ref,
          className: cn(SEMANTIC_CLASS.root, classNames?.root, className),
          "data-tag": tag,
        },
        children,
      );
    },
  );
  Comp.displayName = SEMANTIC_DISPLAY_NAME[tag];
  return Comp;
}

export const SemanticMain = createSemantic("main");
export const SemanticHeader = createSemantic("header");
export const SemanticFooter = createSemantic("footer");
export const SemanticNav = createSemantic("nav");
export const SemanticAside = createSemantic("aside");
export const SemanticSection = createSemantic("section");
export const SemanticArticle = createSemantic("article");
export const SemanticDetails = createSemantic("details");
export const SemanticSummary = createSemantic("summary");

export const Semantic = Object.freeze({
  Main: SemanticMain,
  Header: SemanticHeader,
  Footer: SemanticFooter,
  Nav: SemanticNav,
  Aside: SemanticAside,
  Section: SemanticSection,
  Article: SemanticArticle,
  Details: SemanticDetails,
  Summary: SemanticSummary,
});
