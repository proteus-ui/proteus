export function decimalPlaces(step: number): number {
  if (!Number.isFinite(step)) return 0;
  const text = step.toString().toLowerCase();
  if (text.includes("e-")) {
    const [base = "", exp = "0"] = text.split("e-");
    return Number(exp) + (base.split(".")[1] ?? "").length;
  }
  return (text.split(".")[1] ?? "").length;
}

export function add(n: number, delta: number, step: number): number {
  const places = Math.max(decimalPlaces(n), decimalPlaces(delta), decimalPlaces(step));
  return Number((n + delta).toFixed(places));
}

export function parseDraft(draft: string): number | undefined {
  if (draft.trim() === "") return undefined;
  const parsed = Number(draft);
  return Number.isNaN(parsed) ? undefined : parsed;
}
