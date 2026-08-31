import type { SelectOption } from "./types";

export function labelForId(id: string, options: readonly SelectOption[]): string {
  return options.find((option) => option.value === id)?.label ?? "";
}
