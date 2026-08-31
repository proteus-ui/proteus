import { DURATION_UNIT, MS_PER_SECOND } from "./consts";

export function longestDurationMs(value: string): number {
  return value.split(",").reduce((max, part) => {
    const trimmed = part.trim();
    const ms = trimmed.endsWith(DURATION_UNIT.Ms)
      ? Number.parseFloat(trimmed)
      : Number.parseFloat(trimmed) * MS_PER_SECOND;
    return Number.isFinite(ms) ? Math.max(max, ms) : max;
  }, 0);
}
