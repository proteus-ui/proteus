export function cn(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter((v): v is string => Boolean(v)).join(" ");
}
