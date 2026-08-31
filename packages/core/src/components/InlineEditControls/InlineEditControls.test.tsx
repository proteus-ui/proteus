import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InlineEditControls } from "../../index";

describe("InlineEditControls", () => {
  it("renders Edit when not editing", () => {
    render(
      <InlineEditControls
        editing={false}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  it("renders Save and Cancel when editing", () => {
    render(
      <InlineEditControls editing onEdit={() => {}} onSave={() => {}} onCancel={() => {}} />,
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
});
