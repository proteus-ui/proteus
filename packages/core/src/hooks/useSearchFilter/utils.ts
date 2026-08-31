export function normalizeQuery(query: string): string {
  return query.toLowerCase();
}

export function matchesHaystack(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle);
}
