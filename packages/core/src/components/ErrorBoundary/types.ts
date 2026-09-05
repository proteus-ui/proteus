import type { ReactNode } from "react";

export interface ErrorBoundaryProps {
  /** Tree to protect. */
  children?: ReactNode;
  /** Shown when a descendant throws. */
  fallback?: ReactNode;
  /** Called with the caught error. */
  onError?: (error: Error) => void;
}

export interface ErrorBoundaryState {
  error: Error | null;
}
