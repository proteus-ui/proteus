import type { ReactNode } from "react";

export interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

export interface ErrorBoundaryState {
  error: Error | null;
}
