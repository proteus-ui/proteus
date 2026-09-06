import type { SemanticTag } from "./types";

export const SEMANTIC_CLASS = {
  root: "pr-semantic",
} as const;

export const SEMANTIC_DISPLAY_NAME = {
  main: "SemanticMain",
  header: "SemanticHeader",
  footer: "SemanticFooter",
  nav: "SemanticNav",
  aside: "SemanticAside",
  section: "SemanticSection",
  article: "SemanticArticle",
  details: "SemanticDetails",
  summary: "SemanticSummary",
} as const satisfies Record<SemanticTag, string>;
