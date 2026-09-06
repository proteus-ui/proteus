import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Field, TextInput } from "../../index";

describe("Field", () => {
  it("wires label htmlFor to the control id", () => {
    render(
      <Field label="Email" htmlFor="email-field">
        <TextInput aria-label="Email input" />
      </Field>,
    );
    const label = screen.getByText("Email");
    expect(label.tagName).toBe("LABEL");
    expect(label).toHaveAttribute("for", "email-field");
    expect(screen.getByRole("textbox")).toHaveAttribute("id", "email-field");
  });

  it("marks invalid and exposes error as alert", () => {
    render(
      <Field label="Name" error="Required" invalid>
        <TextInput invalid />
      </Field>,
    );
    expect(document.querySelector(".pr-field")).toHaveAttribute("data-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("merges classNames into slots", () => {
    render(
      <Field
        label="X"
        hint="Tip"
        classNames={{ root: "r", label: "l", control: "c", hint: "h" }}
      >
        <TextInput />
      </Field>,
    );
    expect(document.querySelector(".pr-field")).toHaveClass("pr-field", "r");
    expect(screen.getByText("X")).toHaveClass("pr-field__label", "l");
    expect(document.querySelector(".pr-field__control")).toHaveClass("c");
    expect(screen.getByText("Tip")).toHaveClass("pr-field__hint", "h");
  });
});
