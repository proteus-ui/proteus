import type { AsyncOperationStatus } from "./types";

export const ASYNC_STATUS = {
  Idle: "idle",
  Pending: "pending",
  Success: "success",
  Error: "error",
} as const satisfies Record<string, AsyncOperationStatus>;
