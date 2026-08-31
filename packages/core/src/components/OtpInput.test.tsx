import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OtpInput } from "../index";

function otpCell(cells: HTMLElement[], index: number): HTMLElement {
  const cell = cells[index];
  if (!cell) throw new Error(`expected OTP cell at ${index}`);
  return cell;
}

describe("OtpInput", () => {
  it("types 6 digits and fires onComplete", async () => {
    const onComplete = vi.fn();
    render(<OtpInput onComplete={onComplete} />);
    const cells = screen.getAllByRole("textbox");
    expect(cells).toHaveLength(6);
    await userEvent.type(otpCell(cells, 0), "123456");
    expect(onComplete).toHaveBeenCalledWith("123456");
  });

  it("paste 12ab34 into length 6 keeps digits and focuses", async () => {
    render(<OtpInput />);
    const cells = screen.getAllByRole("textbox");
    otpCell(cells, 0).focus();
    await userEvent.paste("12ab34");
    expect(cells.map((c) => (c as HTMLInputElement).value).join("")).toBe("1234");
  });

  it("Backspace on empty moves left", async () => {
    render(<OtpInput defaultValue="12" />);
    const cells = screen.getAllByRole("textbox");
    otpCell(cells, 2).focus();
    await userEvent.keyboard("{Backspace}");
    expect(cells[1]).toHaveFocus();
  });

  it("disabled skips autofocus", () => {
    render(<OtpInput disabled />);
    expect(screen.getAllByRole("textbox")[0]).not.toHaveFocus();
  });

  it("clears validation error when controlled value resets", async () => {
    const onValidate = vi.fn((next: string) => next.length === 0);
    function Harness() {
      const [value, setValue] = useState("");
      return (
        <>
          <OtpInput value={value} onChange={setValue} onValidate={onValidate} />
          <button type="button" onClick={() => setValue("")}>
            reset
          </button>
        </>
      );
    }
    render(<Harness />);
    const cells = screen.getAllByRole("textbox");
    await userEvent.type(otpCell(cells, 0), "1");
    expect(cells[0]).toHaveAttribute("aria-invalid", "true");
    await userEvent.click(screen.getByRole("button", { name: "reset" }));
    expect(cells[0]).not.toHaveAttribute("aria-invalid");
  });

  it("keeps a hole when a mid-cell is cleared", async () => {
    render(<OtpInput defaultValue="123456" />);
    const cells = screen.getAllByRole("textbox");
    otpCell(cells, 5).focus();
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{Backspace}");
    expect(cells.map((c) => (c as HTMLInputElement).value)).toEqual(["1", "", "3", "4", "5", "6"]);
  });

  it("keeps cell-index validation after controlled echo", async () => {
    const onValidate = vi.fn((_next: string, index?: number) => index !== 0);
    function Harness() {
      const [value, setValue] = useState("");
      return <OtpInput value={value} onChange={setValue} onValidate={onValidate} />;
    }
    render(<Harness />);
    const cells = screen.getAllByRole("textbox");
    await userEvent.type(otpCell(cells, 0), "1");
    expect(cells[0]).toHaveAttribute("aria-invalid", "true");
  });
});
