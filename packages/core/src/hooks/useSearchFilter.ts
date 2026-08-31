import { useMemo } from "react";

export function useSearchFilter<T>(
  items: readonly T[],
  query: string,
  getHaystack: (item: T) => string,
): T[] {
  return useMemo(() => {
    if (!query) return [...items];
    const needle = query.toLowerCase();
    return items.filter((item) =>
      getHaystack(item).toLowerCase().includes(needle),
    );
  }, [items, query, getHaystack]);
}
