export function toCells(joined: string, length: number): string[] {
  const cells = joined.split("").slice(0, length);
  while (cells.length < length) cells.push("");
  return cells;
}

export function resizeCells(cells: string[], length: number): string[] {
  if (cells.length === length) return cells;
  const next = cells.slice(0, length);
  while (next.length < length) next.push("");
  return next;
}
