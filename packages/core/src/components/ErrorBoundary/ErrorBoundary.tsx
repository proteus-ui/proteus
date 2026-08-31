import { Component } from "react";
import { ERROR_BOUNDARY_CLASS, ERROR_BOUNDARY_MESSAGE } from "./consts";
import type { ErrorBoundaryProps, ErrorBoundaryState } from "./types";

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
          <div className={ERROR_BOUNDARY_CLASS.root} role="alert">
            {ERROR_BOUNDARY_MESSAGE}
          </div>
        )
      );
    }
    return this.props.children;
  }
}
