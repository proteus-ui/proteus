import { Component } from "react";
import type { ReactNode } from "react";

export interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div className="pr-error-boundary" role="alert">
            Something went wrong
          </div>
        )
      );
    }
    return this.props.children;
  }
}
