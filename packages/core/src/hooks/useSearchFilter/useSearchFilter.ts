import { useMemo } from "react";
import type { SearchHaystack } from "./types";
import { matchesHaystack, normalizeQuery } from "./utils";

export function useSearchFilter<T>(
  items: readonly T[],
  query: string,
  getHaystack: SearchHaystack<T>,
): T[] {
  return useMemo(() => {
    if (!query) return [...items];
    const needle = normalizeQuery(query);
    return items.filter((item) => matchesHaystack(getHaystack(item), needle));
  }, [items, query, getHaystack]);
}
