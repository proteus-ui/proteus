export type AsyncOperationStatus = "idle" | "pending" | "success" | "error";

export interface UseAsyncOperationReturn {
  status: AsyncOperationStatus;
  error: Error | null;
  run: (fn: () => Promise<void>) => Promise<void>;
}
