import type { JSX } from "react";
import type { SlotClassNames } from "@proteus-ui/tokens";

export type SemanticTag =
  | "main"
  | "header"
  | "footer"
  | "nav"
  | "aside"
  | "section"
  | "article"
  | "details"
  | "summary";

export type SemanticSlot = "root";

export type SemanticProps<T extends SemanticTag = SemanticTag> = JSX.IntrinsicElements[T] & {
  /** Per-slot class names (`root`). */
  classNames?: SlotClassNames<SemanticSlot>;
};

export type SemanticMainProps = SemanticProps<"main">;
export type SemanticHeaderProps = SemanticProps<"header">;
export type SemanticFooterProps = SemanticProps<"footer">;
export type SemanticNavProps = SemanticProps<"nav">;
export type SemanticAsideProps = SemanticProps<"aside">;
export type SemanticSectionProps = SemanticProps<"section">;
export type SemanticArticleProps = SemanticProps<"article">;
export type SemanticDetailsProps = SemanticProps<"details">;
export type SemanticSummaryProps = SemanticProps<"summary">;
