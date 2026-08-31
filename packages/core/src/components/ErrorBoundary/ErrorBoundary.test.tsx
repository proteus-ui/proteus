import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "../../index";

function Boom(): never {
  throw new Error("nope");
}

describe("ErrorBoundary", () => {
  it("renders fallback and calls onError", () => {
    const onError = vi.fn();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary fallback={<p>Oops</p>} onError={onError}>
        <Boom />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Oops")).toBeInTheDocument();
    expect(onError).toHaveBeenCalled();
    spy.mockRestore();
  });
});
