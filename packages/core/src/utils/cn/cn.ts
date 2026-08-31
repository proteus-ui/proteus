import { CLASS_NAME_SEPARATOR } from "./consts";
import type { ClassNameValue } from "./types";

export function cn(...values: Array<ClassNameValue>): string {
  return values.filter((v): v is string => Boolean(v)).join(CLASS_NAME_SEPARATOR);
}
